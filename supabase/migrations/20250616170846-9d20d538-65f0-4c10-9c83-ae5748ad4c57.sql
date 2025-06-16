
-- Add more sample employees to match the design
INSERT INTO public.employees (name, position, department_id, level, qualification, certifications, date_of_birth, job_description, date_of_resumption, profile_image_url) VALUES 

-- Finance Department employees
('Andrea Rodriguez', 'Accounts Receivable Specialist', (SELECT id FROM departments WHERE name = 'Finance/Accounts Department'), 'L9', 'University Graduate', 'AACAA, Microsoft Office', '1993-02-15', 'Manages outgoing payments to suppliers and vendors, processes invoices, and ensures timely payment while maintaining accurate records of transactions.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Accounts Receivable Specialist', (SELECT id FROM departments WHERE name = 'Finance/Accounts Department'), 'L8', 'University Graduate', 'AACAA, Microsoft Office', '1993-02-15', 'Manages outgoing payments to suppliers and vendors, processes invoices, and ensures timely payment while maintaining accurate records of transactions.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Accounts Receivable Specialist', (SELECT id FROM departments WHERE name = 'Finance/Accounts Department'), 'L9', 'University Graduate', 'AACAA, Microsoft Office', '1993-02-15', 'Manages outgoing payments to suppliers and vendors, processes invoices, and ensures timely payment while maintaining accurate records of transactions.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

-- Sales/Marketing Department employees
('Andrea Rodriguez', 'Marketing Specialist', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L7', 'University Graduate', 'Digital Marketing, Google Ads', '1993-02-15', 'Develops and executes marketing campaigns, manages social media presence, and analyzes market trends.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Sales Representative', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L8', 'University Graduate', 'Sales Certification, CRM', '1993-02-15', 'Manages client relationships, generates leads, and closes sales deals.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Marketing Coordinator', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L9', 'University Graduate', 'Marketing Analytics', '1993-02-15', 'Coordinates marketing activities and campaigns across different channels.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Sales Manager', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L8', 'University Graduate', 'Leadership, Sales Management', '1993-02-15', 'Leads sales team and develops sales strategies.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Digital Marketing Specialist', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L9', 'University Graduate', 'SEO, SEM, Social Media', '1993-02-15', 'Manages digital marketing campaigns and online presence.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Account Manager', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L8', 'University Graduate', 'Account Management, CRM', '1993-02-15', 'Manages key client accounts and relationships.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Marketing Analyst', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L7', 'University Graduate', 'Data Analytics, Marketing Research', '1993-02-15', 'Analyzes marketing data and provides insights for strategy.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Sales Coordinator', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L8', 'University Graduate', 'Sales Operations, CRM', '1993-02-15', 'Coordinates sales activities and supports sales team.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Brand Manager', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L9', 'University Graduate', 'Brand Management, Marketing Strategy', '1993-02-15', 'Manages brand identity and marketing strategies.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Content Marketing Specialist', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L8', 'University Graduate', 'Content Creation, SEO', '1993-02-15', 'Creates and manages content marketing campaigns.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Marketing Director', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L10', 'MBA', 'Leadership, Strategic Marketing', '1993-02-15', 'Leads marketing department and develops overall marketing strategy.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png'),

('Andrea Rodriguez', 'Sales Executive', (SELECT id FROM departments WHERE name = 'Sales/Marketing Department'), 'L7', 'University Graduate', 'Sales, Negotiation', '1993-02-15', 'Executes sales strategies and manages client relationships.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png');
