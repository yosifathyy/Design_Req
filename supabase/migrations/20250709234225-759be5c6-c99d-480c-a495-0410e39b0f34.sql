-- Add missing columns to invoice_payments table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_payments' AND column_name = 'payment_reference') THEN
        ALTER TABLE public.invoice_payments ADD COLUMN payment_reference TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_payments' AND column_name = 'paypal_transaction_id') THEN
        ALTER TABLE public.invoice_payments ADD COLUMN paypal_transaction_id TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_payments' AND column_name = 'processed_at') THEN
        ALTER TABLE public.invoice_payments ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_payments' AND column_name = 'notes') THEN
        ALTER TABLE public.invoice_payments ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Create project_timeline table
CREATE TABLE IF NOT EXISTS public.project_timeline (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'update',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.users(id)
);

-- Enable RLS on project_timeline
ALTER TABLE public.project_timeline ENABLE ROW LEVEL SECURITY;

-- Create policies for project_timeline
CREATE POLICY "Users can view timeline for their projects" ON public.project_timeline
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_timeline.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);

CREATE POLICY "Users can add timeline entries for their projects" ON public.project_timeline
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_timeline.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);