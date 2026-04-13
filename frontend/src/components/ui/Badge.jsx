import React from 'react';

const statusConfig = {
  // Project statuses
  todo: { label: 'To Do', classes: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'In Progress', classes: 'bg-blue-100 text-blue-700' },
  on_hold: { label: 'On Hold', classes: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-600' },
  // Task statuses
  done: { label: 'Done', classes: 'bg-green-100 text-green-700' },
  // Invoice statuses
  draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Sent', classes: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid', classes: 'bg-green-100 text-green-700' },
  overdue: { label: 'Overdue', classes: 'bg-red-100 text-red-600' },
  // Priority
  low: { label: 'Low', classes: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', classes: 'bg-red-100 text-red-600' },
  // Role
  admin: { label: 'Admin', classes: 'bg-purple-100 text-purple-700' },
  manager: { label: 'Manager', classes: 'bg-primary-100 text-primary-700' },
  employee: { label: 'Employee', classes: 'bg-teal-100 text-teal-700' },
  client: { label: 'Client', classes: 'bg-orange-100 text-orange-700' },
};

const Badge = ({ status, label: customLabel, className = '' }) => {
  const config = statusConfig[status] || { label: status, classes: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`badge ${config.classes} ${className}`}>
      {customLabel || config.label}
    </span>
  );
};

export default Badge;
