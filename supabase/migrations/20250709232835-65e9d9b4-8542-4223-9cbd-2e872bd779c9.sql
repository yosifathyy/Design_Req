-- Add missing columns to invoices table (round 2)

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'description') THEN
        ALTER TABLE public.invoices ADD COLUMN description TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'subtotal') THEN
        ALTER TABLE public.invoices ADD COLUMN subtotal NUMERIC DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_rate') THEN
        ALTER TABLE public.invoices ADD COLUMN tax_rate NUMERIC DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax_amount') THEN
        ALTER TABLE public.invoices ADD COLUMN tax_amount NUMERIC DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'total_amount') THEN
        ALTER TABLE public.invoices ADD COLUMN total_amount NUMERIC DEFAULT 0;
        -- Copy existing amount to total_amount
        UPDATE public.invoices SET total_amount = amount WHERE total_amount = 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'design_request_id') THEN
        -- Add design_request_id as an alias for request_id
        ALTER TABLE public.invoices ADD COLUMN design_request_id UUID;
        UPDATE public.invoices SET design_request_id = request_id WHERE design_request_id IS NULL;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'notes') THEN
        ALTER TABLE public.invoices ADD COLUMN notes TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'terms') THEN
        ALTER TABLE public.invoices ADD COLUMN terms TEXT;
    END IF;
END $$;