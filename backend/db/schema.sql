-- IT Services / Consulting Management Platform
-- PostgreSQL Schema

-- Enable UUID generation (must be superuser, safe to ignore if already exists)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create and use the saas schema
CREATE SCHEMA IF NOT EXISTS saas;
SET search_path TO saas;

-- ─────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'client');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('todo', 'in_progress', 'on_hold', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          user_role   NOT NULL DEFAULT 'employee',
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  company    VARCHAR(200) NOT NULL,
  contact    VARCHAR(120),
  email      VARCHAR(255),
  phone      VARCHAR(30),
  address    TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID           NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title       VARCHAR(255)   NOT NULL,
  description TEXT,
  status      project_status NOT NULL DEFAULT 'todo',
  start_date  DATE,
  deadline    DATE,
  budget      NUMERIC(12,2),
  created_by  UUID           REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Project ↔ Team Members (many-to-many)
CREATE TABLE IF NOT EXISTS project_members (
  project_id  UUID        REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       VARCHAR(255)  NOT NULL,
  description TEXT,
  status      task_status   NOT NULL DEFAULT 'todo',
  priority    task_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_by  UUID          REFERENCES users(id) ON DELETE SET NULL,
  due_date    DATE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- DELIVERABLES (URL references only for MVP)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deliverables (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  url         TEXT        NOT NULL,
  uploaded_by UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- INVOICES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID           NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id   UUID           NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_no  VARCHAR(50)    UNIQUE NOT NULL,
  amount      NUMERIC(12,2)  NOT NULL,
  status      invoice_status NOT NULL DEFAULT 'draft',
  issued_date DATE           NOT NULL DEFAULT CURRENT_DATE,
  due_date    DATE,
  notes       TEXT,
  created_by  UUID           REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_client_id  ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status     ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_deadline   ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id    ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to   ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date      ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status        ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id  ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status     ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id     ON clients(user_id);
