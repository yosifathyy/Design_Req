-- Create project_tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES public.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_tasks
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for project_tasks
CREATE POLICY "Users can view tasks for their projects" ON public.project_tasks
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_tasks.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);

CREATE POLICY "Users can create tasks for their projects" ON public.project_tasks
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_tasks.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);

CREATE POLICY "Users can update tasks for their projects" ON public.project_tasks
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_tasks.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);

CREATE POLICY "Users can delete tasks for their projects" ON public.project_tasks
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_tasks.project_id 
        AND (projects.user_id = auth.uid() OR projects.designer_id = auth.uid())
    )
);