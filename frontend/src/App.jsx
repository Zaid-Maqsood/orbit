import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientsListPage from './pages/clients/ClientsListPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import TasksPage from './pages/tasks/TasksPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import TeamPage from './pages/team/TeamPage';
import CreateUserPage from './pages/admin/CreateUserPage';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalProjectDetail from './pages/portal/PortalProjectDetail';
import PortalInvoices from './pages/portal/PortalInvoices';
import PortalMessages from './pages/portal/PortalMessages';
import NotFoundPage from './pages/NotFoundPage';

const INTERNAL = ['admin', 'manager', 'employee'];
const MANAGER_PLUS = ['admin', 'manager'];
const ADMIN_ONLY = ['admin'];
const CLIENT_ONLY = ['client'];

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Root redirect handled in ProtectedRoute */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Internal App */}
        <Route element={<ProtectedRoute allowedRoles={INTERNAL} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Route>
        </Route>

        {/* Manager+ routes */}
        <Route element={<ProtectedRoute allowedRoles={MANAGER_PLUS} />}>
          <Route element={<AppLayout />}>
            <Route path="/clients" element={<ClientsListPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Route>
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={ADMIN_ONLY} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/users/new" element={<CreateUserPage />} />
          </Route>
        </Route>

        {/* Client Portal */}
        <Route element={<ProtectedRoute allowedRoles={CLIENT_ONLY} />}>
          <Route element={<AppLayout />}>
            <Route path="/portal" element={<PortalDashboard />} />
            <Route path="/portal/projects/:id" element={<PortalProjectDetail />} />
            <Route path="/portal/invoices" element={<PortalInvoices />} />
            <Route path="/portal/messages/:projectId" element={<PortalMessages />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
