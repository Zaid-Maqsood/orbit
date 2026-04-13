import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

const ClientForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    company: '', contact: '', email: '', phone: '', address: '', notes: '',
    createLogin: false, loginPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/clients', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Company Name *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
        </div>
        <Input label="Contact Person" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div className="col-span-2">
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="input-field resize-none"
            placeholder="Internal notes..."
          />
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.createLogin}
              onChange={e => setForm({ ...form, createLogin: e.target.checked })}
              className="rounded border-gray-300 text-primary cursor-pointer"
            />
            <span className="text-sm text-gray-700">Create client portal login</span>
          </label>
        </div>
        {form.createLogin && (
          <div className="col-span-2">
            <Input
              label="Portal Password"
              type="password"
              value={form.loginPassword}
              onChange={e => setForm({ ...form, loginPassword: e.target.value })}
              placeholder="Leave blank for default (Client@1234)"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>Create Client</Button>
      </div>
    </form>
  );
};

const ClientsListPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/clients');
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter(c =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-text-main text-xl">Clients</h2>
          <p className="text-gray-500 text-sm">{clients.length} total clients</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} />
          New Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <Card
            key={client.id}
            onClick={() => navigate(`/clients/${client.id}`)}
            className="cursor-pointer hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-gray-900 truncate">{client.company}</h3>
                {client.contact && <p className="text-sm text-gray-600 mt-0.5">{client.contact}</p>}
                <div className="mt-2 space-y-1">
                  {client.email && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail size={12} />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={12} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Added {new Date(client.created_at).toLocaleDateString()}
              </span>
              {client.user_id && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Portal Active
                </span>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No clients found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Client">
        <ClientForm
          onSuccess={() => { setShowModal(false); fetchClients(); }}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ClientsListPage;
