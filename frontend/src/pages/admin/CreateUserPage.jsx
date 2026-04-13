import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/users', form);
      setSuccess(`User "${form.name}" created successfully.`);
      setForm({ name: '', email: '', password: '', role: 'employee' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <button onClick={() => navigate('/team')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
        <ArrowLeft size={16} /> Back to Team
      </button>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <UserPlus size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-text-main text-xl">Create User</h2>
            <p className="text-gray-500 text-sm">Add a new team member or client portal user</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="John Smith" />
          <Input label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="john@company.com" />
          <Input label="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Min 8 characters" minLength={8} />
          <Select
            label="Role *"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Admin — Full access' },
              { value: 'manager', label: 'Manager — Manage projects & invoices' },
              { value: 'employee', label: 'Employee — View & update assigned tasks' },
              { value: 'client', label: 'Client — Read-only portal access' },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => navigate('/team')} type="button">Cancel</Button>
            <Button type="submit" loading={loading}>Create User</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateUserPage;
