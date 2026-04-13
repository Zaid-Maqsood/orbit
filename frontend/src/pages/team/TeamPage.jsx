import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCog, Mail } from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const TeamPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleActive = async (user) => {
    if (!isAdmin) return;
    try {
      await api.put(`/users/${user.id}`, { is_active: !user.is_active });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  const grouped = {
    admin: users.filter(u => u.role === 'admin'),
    manager: users.filter(u => u.role === 'manager'),
    employee: users.filter(u => u.role === 'employee'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-text-main text-xl">Team</h2>
          <p className="text-gray-500 text-sm">{users.length} team members</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate('/admin/users/new')}>
            <UserPlus size={16} /> Add Member
          </Button>
        )}
      </div>

      {Object.entries(grouped).map(([role, members]) => (
        members.length > 0 && (
          <Card key={role}>
            <CardHeader
              title={`${role.charAt(0).toUpperCase() + role.slice(1)}s`}
              subtitle={`${members.length} member${members.length !== 1 ? 's' : ''}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {members.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors
                              ${user.is_active ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'admin' ? 'bg-purple-100 text-purple-600' :
                    role === 'manager' ? 'bg-primary-100 text-primary' :
                    'bg-teal-100 text-teal-600'
                  }`}>
                    <span className="font-heading font-bold text-base">{user.name[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500 truncate">
                      <Mail size={11} />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        user.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )
      ))}
    </div>
  );
};

export default TeamPage;
