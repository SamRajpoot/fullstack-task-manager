-- Insert sample users
INSERT INTO users (email, password, name) VALUES 
('admin@taskmanager.com', 'ZGVtb3Bhc3M=', 'Admin User'),
('john@taskmanager.com', 'ZGVtb3Bhc3M=', 'John Doe'),
('jane@taskmanager.com', 'ZGVtb3Bhc3M=', 'Jane Smith'),
('mike@taskmanager.com', 'ZGVtb3Bhc3M=', 'Mike Johnson')
ON CONFLICT (email) DO NOTHING;

-- Insert sample teams
INSERT INTO teams (name, description, owner_id) VALUES 
('Development Team', 'Frontend and backend development team', 1),
('Design Team', 'UI/UX design and creative team', 2),
('Marketing Team', 'Marketing and growth team', 3)
ON CONFLICT DO NOTHING;

-- Insert team members
INSERT INTO team_members (team_id, user_id, role) VALUES 
(1, 1, 'owner'),
(1, 2, 'member'),
(1, 4, 'member'),
(2, 2, 'owner'),
(2, 3, 'member'),
(3, 3, 'owner'),
(3, 4, 'member')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, team_id, assigned_to, created_by, status, priority) VALUES 
('Setup project structure', 'Initialize the project with proper folder structure', 1, 2, 1, 'completed', 'high'),
('Design user interface', 'Create wireframes and mockups for the application', 2, 3, 2, 'in_progress', 'high'),
('Implement authentication', 'Build secure login and registration system', 1, 4, 1, 'in_progress', 'high'),
('Create marketing strategy', 'Develop comprehensive marketing plan', 3, 4, 3, 'todo', 'medium'),
('Write unit tests', 'Add comprehensive test coverage', 1, 2, 1, 'todo', 'medium'),
('Design landing page', 'Create attractive landing page design', 2, 3, 2, 'todo', 'low')
ON CONFLICT DO NOTHING;
