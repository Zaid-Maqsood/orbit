-- IT Platform Seed Data
-- All passwords are bcrypt hashes of: Admin@1234
-- Generated with bcrypt rounds=10

SET search_path TO saas;

-- ─────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Alex Admin',        'admin@itfirm.com',          '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'admin'),
  ('a1000000-0000-0000-0000-000000000002', 'Sarah Manager',     'sarah.manager@itfirm.com',  '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'manager'),
  ('a1000000-0000-0000-0000-000000000003', 'James Manager',     'james.manager@itfirm.com',  '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'manager'),
  ('a1000000-0000-0000-0000-000000000004', 'Dev One',           'dev1@itfirm.com',           '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'employee'),
  ('a1000000-0000-0000-0000-000000000005', 'Dev Two',           'dev2@itfirm.com',           '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'employee'),
  ('a1000000-0000-0000-0000-000000000006', 'Dana Designer',     'designer@itfirm.com',       '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'employee'),
  ('a1000000-0000-0000-0000-000000000007', 'Acme CTO',          'cto@acmecorp.com',          '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'client'),
  ('a1000000-0000-0000-0000-000000000008', 'Globex IT Manager', 'it@globex.com',             '$2a$10$/4cDNgZxLu1Js6Co0og7je5z7pbFt5WjC6IybLi/h1TatKAGuJ2Mm', 'client')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────────────────────────────
INSERT INTO clients (id, user_id, company, contact, email, phone, address, notes) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'Acme Corp',  'Acme CTO',          'cto@acmecorp.com', '+1-555-0101', '100 Business Ave, New York, NY 10001', 'Enterprise client — priority support'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000008', 'Globex Inc', 'Globex IT Manager', 'it@globex.com',    '+1-555-0202', '200 Tech Park, Austin, TX 73301',      'Mid-market client — monthly check-ins')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────────────────────────
INSERT INTO projects (id, client_id, title, description, status, start_date, deadline, budget, created_by) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Acme ERP Integration',
    'Integrate Acme Corp legacy ERP system with modern REST APIs and build a real-time dashboard for inventory and order management.',
    'in_progress',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '30 days',
    45000.00,
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Acme Website Redesign',
    'Full redesign of the Acme Corp public-facing website with modern UI, SEO optimizations, and CMS integration.',
    'completed',
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE - INTERVAL '10 days',
    18000.00,
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'Globex Network Audit',
    'Comprehensive security and performance audit of Globex data center network infrastructure.',
    'todo',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '15 days',
    12000.00,
    'a1000000-0000-0000-0000-000000000003'
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000002',
    'Globex Cloud Migration',
    'Migrate Globex on-premise infrastructure to AWS. Includes lift-and-shift of 12 services and database migrations.',
    'in_progress',
    CURRENT_DATE - INTERVAL '45 days',
    CURRENT_DATE - INTERVAL '5 days',
    72000.00,
    'a1000000-0000-0000-0000-000000000003'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- PROJECT MEMBERS
-- ─────────────────────────────────────────────────────────────────
INSERT INTO project_members (project_id, user_id) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000006'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────────────────────────────
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by, due_date) VALUES
  -- Acme ERP Integration tasks
  (
    'd1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Design API schema for inventory module',
    'Define REST endpoints, request/response shapes, and authentication flow for the inventory API.',
    'done', 'high',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '15 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'Build order management API endpoints',
    'Implement CRUD endpoints for orders with pagination and filtering.',
    'in_progress', 'high',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE + INTERVAL '7 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'Integrate real-time dashboard with WebSocket',
    'Add WebSocket support for live inventory updates on the dashboard.',
    'todo', 'medium',
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE + INTERVAL '20 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000001',
    'Write API documentation',
    'Document all API endpoints in Swagger/OpenAPI format.',
    'todo', 'low',
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE + INTERVAL '25 days'
  ),
  -- Acme Website Redesign tasks (completed project)
  (
    'd1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000002',
    'UI/UX wireframes and mockups',
    'Create complete wireframes for all pages and stakeholder-approved mockups.',
    'done', 'high',
    'a1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '50 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000002',
    'Frontend implementation',
    'Implement approved designs using React and TailwindCSS.',
    'done', 'high',
    'a1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '20 days'
  ),
  -- Globex Cloud Migration tasks (past deadline)
  (
    'd1000000-0000-0000-0000-000000000007',
    'c1000000-0000-0000-0000-000000000004',
    'Audit existing on-premise services',
    'Inventory all services, databases, and dependencies before migration.',
    'done', 'high',
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '30 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000004',
    'Migrate primary database to RDS',
    'Perform zero-downtime migration of PostgreSQL database to AWS RDS.',
    'in_progress', 'high',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '3 days'
  ),
  (
    'd1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000004',
    'Setup CI/CD pipelines on AWS',
    'Configure CodePipeline and CodeDeploy for automated deployments.',
    'todo', 'medium',
    'a1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '1 day'
  ),
  -- Globex Network Audit tasks
  (
    'd1000000-0000-0000-0000-000000000010',
    'c1000000-0000-0000-0000-000000000003',
    'Network topology mapping',
    'Create detailed network topology map of all Globex data center segments.',
    'todo', 'medium',
    'a1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000003',
    CURRENT_DATE + INTERVAL '12 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- DELIVERABLES
-- ─────────────────────────────────────────────────────────────────
INSERT INTO deliverables (id, project_id, name, url, uploaded_by) VALUES
  (
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'Website Redesign — Final Designs (Figma)',
    'https://www.figma.com/file/example-acme-designs',
    'a1000000-0000-0000-0000-000000000006'
  ),
  (
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'Website Redesign — QA Report',
    'https://docs.google.com/document/d/example-qa-report',
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'e1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'ERP API Schema v1.0 (OpenAPI)',
    'https://docs.google.com/document/d/example-api-schema',
    'a1000000-0000-0000-0000-000000000004'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- INVOICES
-- ─────────────────────────────────────────────────────────────────
INSERT INTO invoices (id, project_id, client_id, invoice_no, amount, status, issued_date, due_date, notes, created_by) VALUES
  (
    'f1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'INV-2024-001',
    18000.00,
    'paid',
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE - INTERVAL '30 days',
    'Final payment for Acme Website Redesign project.',
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'f1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'INV-2024-002',
    22500.00,
    'sent',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '15 days',
    'Milestone 1 payment — ERP Integration (50%).',
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'f1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000002',
    'INV-2024-003',
    36000.00,
    'overdue',
    CURRENT_DATE - INTERVAL '45 days',
    CURRENT_DATE - INTERVAL '15 days',
    'Phase 1 payment — Cloud Migration (50%).',
    'a1000000-0000-0000-0000-000000000003'
  ),
  (
    'f1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'INV-2024-004',
    12000.00,
    'draft',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    'Full payment — Globex Network Audit.',
    'a1000000-0000-0000-0000-000000000003'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────────────────────────
INSERT INTO messages (id, project_id, sender_id, body, created_at) VALUES
  (
    'f2000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000007',
    'Hi team, can we get an update on the order management API progress? Our stakeholders are asking for a demo next week.',
    NOW() - INTERVAL '5 days'
  ),
  (
    'f2000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'Hi! We are currently 60% through the order management endpoints. We should be ready for a demo by end of next week. Dev One is on it full-time.',
    NOW() - INTERVAL '4 days 20 hours'
  ),
  (
    'f2000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000004',
    'Just a quick update — I have completed the GET and POST endpoints. Working on PUT/DELETE and pagination today. On track for the demo.',
    NOW() - INTERVAL '3 days'
  ),
  (
    'f2000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000007',
    'Great progress! Please also make sure the API handles bulk order imports. We will need that for the go-live.',
    NOW() - INTERVAL '2 days'
  ),
  (
    'f2000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'Noted on the bulk import requirement — we will add it to the next sprint. I will create a task for it today.',
    NOW() - INTERVAL '1 day 12 hours'
  )
ON CONFLICT (id) DO NOTHING;
