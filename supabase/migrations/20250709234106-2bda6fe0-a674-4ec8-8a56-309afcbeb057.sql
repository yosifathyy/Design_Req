-- Add missing PayPal columns to invoices table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'paypal_order_id') THEN
        ALTER TABLE public.invoices ADD COLUMN paypal_order_id TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'paypal_payer_id') THEN
        ALTER TABLE public.invoices ADD COLUMN paypal_payer_id TEXT;
    END IF;
END $$;