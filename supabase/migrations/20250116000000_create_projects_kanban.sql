-- Create projects table for Kanban board
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'needs-feedback', 'revisions', 'completed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    client_name TEXT NOT NULL,
    client_email TEXT,
    designer_id UUID REFERENCES users(id),
    budget DECIMAL(10,2),
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table for project tasks
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES users(id),
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project timeline/comments table
CREATE TABLE IF NOT EXISTS project_timeline (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'comment' CHECK (type IN ('comment', 'status_change', 'file_upload', 'task_update')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_designer_id ON projects(designer_id);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON projects(due_date);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_timeline_project_id ON project_timeline(project_id);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Everyone can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects" ON projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

CREATE POLICY "Admins and assigned designers can update projects" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.role IN ('admin', 'super-admin') OR users.id = projects.designer_id)
        )
    );

CREATE POLICY "Admins can delete projects" ON projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

-- Create policies for project_tasks
CREATE POLICY "Everyone can view project tasks" ON project_tasks
    FOR SELECT USING (true);

CREATE POLICY "Admins and assigned users can insert tasks" ON project_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.role IN ('admin', 'super-admin') OR users.id = project_tasks.assigned_to)
        )
    );

CREATE POLICY "Admins and assigned users can update tasks" ON project_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.role IN ('admin', 'super-admin') OR users.id = project_tasks.assigned_to)
        )
    );

CREATE POLICY "Admins can delete tasks" ON project_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

-- Create policies for project_timeline
CREATE POLICY "Everyone can view project timeline" ON project_timeline
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert timeline entries" ON project_timeline
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timeline entries" ON project_timeline
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete timeline entries" ON project_timeline
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super-admin')
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at 
    BEFORE UPDATE ON project_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO projects (title, description, status, priority, client_name, client_email, budget, estimated_hours, due_date) VALUES
('Modern Website Redesign', 'Complete redesign of company website with modern UI/UX', 'in-progress', 'high', 'Tech Corp Inc', 'contact@techcorp.com', 5000.00, 40, NOW() + INTERVAL '10 days'),
('Mobile App UI Design', 'Design user interface for iOS and Android mobile application', 'new', 'medium', 'StartupXYZ', 'hello@startupxyz.com', 3500.00, 30, NOW() + INTERVAL '15 days'),
('Brand Identity Package', 'Logo design and brand identity guidelines', 'needs-feedback', 'urgent', 'Fashion Brand Co', 'info@fashionbrand.com', 2500.00, 20, NOW() + INTERVAL '5 days'),
('E-commerce Platform Design', 'Complete UI/UX design for e-commerce platform', 'revisions', 'high', 'Online Store Ltd', 'support@onlinestore.com', 7500.00, 60, NOW() + INTERVAL '20 days'),
('Landing Page Design', 'Marketing landing page for product launch', 'completed', 'low', 'Product Launch Inc', 'marketing@productlaunch.com', 1500.00, 15, NOW() - INTERVAL '2 days');

-- Insert sample tasks
INSERT INTO project_tasks (project_id, title, description, status, priority, estimated_hours, due_date)
SELECT 
    p.id,
    'Task for ' || p.title,
    'Sample task description for ' || p.title,
    CASE 
        WHEN p.status = 'completed' THEN 'completed'
        WHEN p.status = 'in-progress' THEN 'in-progress'
        ELSE 'pending'
    END,
    p.priority,
    5,
    p.due_date - INTERVAL '2 days'
FROM projects p;
