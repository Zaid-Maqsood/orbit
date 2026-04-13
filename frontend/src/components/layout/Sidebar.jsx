import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, CheckSquare,
  FileText, UserCog, LogOut, Menu, X, Building2,
  Briefcase, CreditCard, MessageSquare, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';

const navItems = {
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Building2, label: 'Clients' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/invoices', icon: FileText, label: 'Invoices' },
    { to: '/team', icon: UserCog, label: 'Team' },
  ],
  manager: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Building2, label: 'Clients' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/invoices', icon: FileText, label: 'Invoices' },
    { to: '/team', icon: UserCog, label: 'Team' },
  ],
  employee: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
  ],
  client: [
    { to: '/portal', icon: Briefcase, label: 'My Projects', end: true },
    { to: '/portal/invoices', icon: CreditCard, label: 'Invoices' },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-primary-700">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Planet replaces the "O" */}
          <svg
            viewBox="0 0 64 48"
            style={{ height: '27px', width: 'auto', flexShrink: 0 }}
            fill="none"
          >
            <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="2.2" />
            <ellipse cx="27" cy="26" rx="27" ry="9"
              stroke="white" strokeWidth="2.2"
              transform="rotate(-18 27 26)" />
            <circle cx="52" cy="12" r="2.6" fill="white" />
          </svg>
          {/* "rbit" — light weight, tight to the circle */}
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 300,
            fontSize: '22px',
            color: 'white',
            letterSpacing: '0.04em',
            lineHeight: 1,
            marginLeft: '-8px',
          }}>rbit</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-heading font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-primary-300 text-xs capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-200 hover:bg-primary-700 hover:text-white'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-primary-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium
                     text-primary-200 hover:bg-primary-700 hover:text-white transition-colors
                     duration-150 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-800 h-screen sticky top-0 flex-shrink-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
