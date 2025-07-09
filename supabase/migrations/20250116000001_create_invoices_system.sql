-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    design_request_id UUID REFERENCES design_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    designer_id UUID REFERENCES users(id),
    
    -- Invoice details
    title TEXT NOT NULL,
    description TEXT,
    
    -- Financial details
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and dates
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment details
    payment_method TEXT CHECK (payment_method IN ('paypal', 'stripe', 'bank_transfer')),
    payment_reference TEXT,
    paypal_order_id TEXT,
    paypal_payer_id TEXT,
    
    -- Additional info
    notes TEXT,
    terms TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice line items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_type TEXT DEFAULT 'service' CHECK (item_type IN ('service', 'product', 'design', 'consultation')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment history table
CREATE TABLE IF NOT EXISTS invoice_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    paypal_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_designer_id ON invoices(designer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_design_request_id ON invoices(design_request_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (user_id = auth.uid() OR designer_id = auth.uid());

CREATE POLICY "Admins can view all invoices" ON invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

CREATE POLICY "Admins and designers can create invoices" ON invoices
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin', 'designer')
        )
    );

CREATE POLICY "Admins and assigned designers can update invoices" ON invoices
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.role IN ('admin', 'super-admin') OR users.id = invoices.designer_id)
        )
    );

-- Create policies for line items
CREATE POLICY "Users can view line items of their invoices" ON invoice_line_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_line_items.invoice_id 
            AND (invoices.user_id = auth.uid() OR invoices.designer_id = auth.uid())
        )
    );

CREATE POLICY "Admins can view all line items" ON invoice_line_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

CREATE POLICY "Admins and designers can manage line items" ON invoice_line_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin', 'designer')
        )
    );

-- Create policies for payments
CREATE POLICY "Users can view payments for their invoices" ON invoice_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_payments.invoice_id 
            AND (invoices.user_id = auth.uid() OR invoices.designer_id = auth.uid())
        )
    );

CREATE POLICY "Admins can view all payments" ON invoice_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

CREATE POLICY "System can insert payments" ON invoice_payments
    FOR INSERT WITH CHECK (true);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    next_number INTEGER;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM invoices
    WHERE invoice_number LIKE year_part || '-%';
    
    sequence_part := LPAD(next_number::TEXT, 4, '0');
    
    RETURN year_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample invoices
DO $$
DECLARE
    sample_user_id UUID;
    sample_designer_id UUID;
    sample_request_id UUID;
    invoice_id UUID;
BEGIN
    -- Get sample user IDs
    SELECT id INTO sample_user_id FROM users WHERE email LIKE '%@demo.com' LIMIT 1;
    SELECT id INTO sample_designer_id FROM users WHERE role = 'designer' LIMIT 1;
    SELECT id INTO sample_request_id FROM design_requests LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Create sample invoice
        INSERT INTO invoices (
            design_request_id, user_id, designer_id, title, description,
            subtotal, tax_rate, tax_amount, total_amount, status, due_date
        ) VALUES (
            sample_request_id, sample_user_id, sample_designer_id,
            'Website Design Project', 'Complete website redesign with modern UI/UX',
            2500.00, 8.25, 206.25, 2706.25, 'sent', NOW() + INTERVAL '14 days'
        ) RETURNING id INTO invoice_id;
        
        -- Add line items
        INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total_price) VALUES
        (invoice_id, 'UI/UX Design', 1, 1500.00, 1500.00),
        (invoice_id, 'Frontend Development', 1, 800.00, 800.00),
        (invoice_id, 'Testing & Optimization', 1, 200.00, 200.00);
        
        -- Create another paid invoice
        INSERT INTO invoices (
            design_request_id, user_id, designer_id, title, description,
            subtotal, tax_rate, tax_amount, total_amount, status, due_date, paid_at, payment_method
        ) VALUES (
            sample_request_id, sample_user_id, sample_designer_id,
            'Logo Design Package', 'Complete brand identity design package',
            800.00, 8.25, 66.00, 866.00, 'paid', NOW() + INTERVAL '7 days', NOW() - INTERVAL '2 days', 'paypal'
        ) RETURNING id INTO invoice_id;
        
        -- Add line items for paid invoice
        INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total_price) VALUES
        (invoice_id, 'Logo Design', 1, 500.00, 500.00),
        (invoice_id, 'Brand Guidelines', 1, 300.00, 300.00);
        
        -- Add payment record
        INSERT INTO invoice_payments (invoice_id, amount, payment_method, status) VALUES
        (invoice_id, 866.00, 'paypal', 'completed');
    END IF;
END $$;
