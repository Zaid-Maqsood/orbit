# IT Services / Consulting Management Platform

A full-stack MVP for IT agencies to manage clients, projects, tasks, and billing — with a separate read-only client portal.

## Tech Stack

- **Frontend:** React 18 + Vite + TailwindCSS + Lucide Icons
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (Bearer token)

## Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm

---

## Quick Start

### 1. Clone and navigate

```bash
git clone <repo-url>
cd saas
```

### 2. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE itplatform;"
```

### 3. Run the schema and seed data

```bash
psql -U postgres -d itplatform -f backend/db/schema.sql
psql -U postgres -d itplatform -f backend/db/seed.sql
```

### 4. Setup the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your database credentials and JWT secret:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itplatform
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_long_random_secret_here
```

Start the backend:

```bash
npm run dev
# Server running on http://localhost:5000
```

### 5. Setup the frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

The `.env` defaults are fine for local development:

```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
# App running on http://localhost:5173
```

---

## Login Credentials (Seed Data)

All accounts use password: **`Admin@1234`**

| Role     | Email                        | Access                                          |
|----------|------------------------------|-------------------------------------------------|
| Admin    | `admin@itfirm.com`           | Full access — all features + user management    |
| Manager  | `sarah.manager@itfirm.com`   | Manage clients, projects, tasks, invoices       |
| Manager  | `james.manager@itfirm.com`   | Same as above                                   |
| Employee | `dev1@itfirm.com`            | View assigned projects, update task status      |
| Employee | `dev2@itfirm.com`            | Same as above                                   |
| Employee | `designer@itfirm.com`        | Same as above                                   |
| Client   | `cto@acmecorp.com`           | Client portal — Acme Corp projects & invoices   |
| Client   | `it@globex.com`              | Client portal — Globex Inc projects & invoices  |

---

## User Roles

| Role     | Permissions                                                                 |
|----------|-----------------------------------------------------------------------------|
| Admin    | Everything — create/delete users, manage all data                            |
| Manager  | Create projects, tasks, invoices; manage clients and team                   |
| Employee | View assigned projects and tasks; update status of their own tasks          |
| Client   | Read-only portal — view their projects, deliverables, invoices; send messages |

---

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Path                              | Auth   | Description                      |
|--------|-----------------------------------|--------|----------------------------------|
| POST   | `/auth/login`                     | Public | Login, returns JWT               |
| GET    | `/auth/me`                        | JWT    | Current user profile             |
| GET    | `/users`                          | Admin/Manager | List team members         |
| POST   | `/users`                          | Admin  | Create user                      |
| GET    | `/clients`                        | Admin/Manager | List all clients          |
| POST   | `/clients`                        | Admin/Manager | Create client             |
| GET    | `/projects`                       | Internal | List projects (scoped by role) |
| POST   | `/projects`                       | Manager+ | Create project               |
| GET    | `/projects/:id`                   | Internal | Project detail + tasks        |
| POST   | `/tasks`                          | Manager+ | Create task (sends email)     |
| PUT    | `/tasks/:id`                      | Internal | Update task (field-level RBAC) |
| GET    | `/invoices`                       | Manager+ | List invoices                |
| POST   | `/invoices`                       | Manager+ | Create invoice               |
| GET    | `/portal/projects`                | Client | Client's projects              |
| GET    | `/portal/invoices`                | Client | Client's invoices              |
| GET    | `/stats/overview`                 | Manager+ | Dashboard stats              |

---

## Project Structure

```
saas/
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/db.js           # PostgreSQL connection pool
│   ├── middleware/            # auth.js, roles.js, errorHandler.js
│   ├── models/                # Thin query modules (no ORM)
│   ├── controllers/           # Business logic
│   ├── routes/                # Route definitions
│   ├── services/emailService.js  # Nodemailer (stubbed)
│   ├── jobs/deadlineChecker.js   # Hourly overdue alerts
│   └── db/
│       ├── schema.sql         # Database schema
│       └── seed.sql           # Sample data
└── frontend/
    ├── src/
    │   ├── api/axios.js       # Axios instance + auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/        # Layout, UI, auth components
    │   └── pages/             # All application pages
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Email Notifications (Optional)

Emails are stubbed by default. To enable real sending, add SMTP credentials to `backend/.env`:

```ini
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=IT Platform <your_email@gmail.com>
```

Notifications are sent for:
- Task assignment (to assignee)
- Project status changes (to client)
- Missed deadlines (checked hourly)

---

## Design System

- **Colors:** Primary Navy `#1E40AF`, Secondary Blue `#3B82F6`, CTA Orange `#F97316`
- **Typography:** Poppins (headings) + Open Sans (body)
- **Icons:** Lucide React
