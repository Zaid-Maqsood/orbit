import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;
  return {
    role,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isManagerOrAdmin: role === 'admin' || role === 'manager',
    isEmployee: role === 'employee',
    isClient: role === 'client',
    isInternal: ['admin', 'manager', 'employee'].includes(role),
  };
};
