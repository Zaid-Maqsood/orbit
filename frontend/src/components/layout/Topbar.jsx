import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clients',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/invoices': 'Invoices',
  '/team': 'Team Management',
  '/admin/users/new': 'Create User',
  '/portal': 'My Projects',
  '/portal/invoices': 'Invoices',
};

const Topbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const getTitle = () => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    if (pathname.startsWith('/projects/')) return 'Project Details';
    if (pathname.startsWith('/clients/')) return 'Client Details';
    if (pathname.startsWith('/portal/projects/')) return 'Project Details';
    if (pathname.startsWith('/portal/messages/')) return 'Messages';
    return 'Orbit';
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <h1 className="font-heading font-semibold text-text-main text-lg pl-10 lg:pl-0">
        {getTitle()}
      </h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-heading font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
