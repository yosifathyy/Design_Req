
-- Fix database schema issues

-- 1. Create missing invoice_line_items table
CREATE TABLE IF NOT EXISTS public.invoice_line_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    item_type TEXT NOT NULL DEFAULT 'service',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create missing invoice_payments table
CREATE TABLE IF NOT EXISTS public.invoice_payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Add missing columns to invoices table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'invoice_number') THEN
        ALTER TABLE public.invoices ADD COLUMN invoice_number TEXT UNIQUE;
        -- Generate invoice numbers for existing records
        UPDATE public.invoices SET invoice_number = 'INV-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 4, '0');
        ALTER TABLE public.invoices ALTER COLUMN invoice_number SET NOT NULL;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'title') THEN
        ALTER TABLE public.invoices ADD COLUMN title TEXT NOT NULL DEFAULT 'Design Services';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'user_id') THEN
        ALTER TABLE public.invoices ADD COLUMN user_id UUID;
        -- Populate user_id from design_requests
        UPDATE public.invoices SET user_id = dr.user_id 
        FROM public.design_requests dr 
        WHERE dr.id = invoices.request_id;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'designer_id') THEN
        ALTER TABLE public.invoices ADD COLUMN designer_id UUID;
        -- Populate designer_id from design_requests
        UPDATE public.invoices SET designer_id = dr.designer_id 
        FROM public.design_requests dr 
        WHERE dr.id = invoices.request_id;
    END IF;
END $$;

-- 4. Add missing columns to chats table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chats' AND column_name = 'updated_at') THEN
        ALTER TABLE public.chats ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
    END IF;
END $$;

-- 5. Add content column to messages (alias for text for backward compatibility)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'content') THEN
        ALTER TABLE public.messages ADD COLUMN content TEXT;
        -- Copy existing text data to content
        UPDATE public.messages SET content = text WHERE content IS NULL;
        -- Make content required
        ALTER TABLE public.messages ALTER COLUMN content SET NOT NULL;
    END IF;
END $$;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON public.invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON public.invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_designer_id ON public.invoices(designer_id);

-- 7. Enable RLS on new tables
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for invoice_line_items
CREATE POLICY "Users can view line items for their invoices" ON public.invoice_line_items
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE invoices.id = invoice_line_items.invoice_id 
        AND (invoices.user_id = auth.uid() OR invoices.designer_id = auth.uid())
    )
);

CREATE POLICY "Admins can manage line items" ON public.invoice_line_items
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'super-admin')
    )
);

-- 9. Create RLS policies for invoice_payments
CREATE POLICY "Users can view payments for their invoices" ON public.invoice_payments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE invoices.id = invoice_payments.invoice_id 
        AND (invoices.user_id = auth.uid() OR invoices.designer_id = auth.uid())
    )
);

CREATE POLICY "Admins can manage payments" ON public.invoice_payments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'super-admin')
    )
);

-- 10. Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Create a function to generate proper UUIDs for mock users (for development)
CREATE OR REPLACE FUNCTION public.get_or_create_mock_admin_user()
RETURNS UUID AS $$
DECLARE
    mock_user_id UUID;
BEGIN
    -- Check if mock admin user exists
    SELECT id INTO mock_user_id 
    FROM public.users 
    WHERE email = 'admin@mocksite.com' 
    LIMIT 1;
    
    -- If not exists, create it
    IF mock_user_id IS NULL THEN
        INSERT INTO public.users (
            id,
            email,
            name,
            role,
            status
        ) VALUES (
            gen_random_uuid(),
            'admin@mocksite.com',
            'Mock Admin User',
            'admin',
            'active'
        ) RETURNING id INTO mock_user_id;
    END IF;
    
    RETURN mock_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
