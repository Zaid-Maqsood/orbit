import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, FolderOpen, Edit2, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchClient = async () => {
    try {
      const { data } = await api.get(`/clients/${id}`);
      setClient(data);
      setEditForm({
        company: data.company, contact: data.contact || '',
        email: data.email || '', phone: data.phone || '',
        address: data.address || '', notes: data.notes || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClient(); }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/clients/${id}`, editForm);
      setEditOpen(false);
      fetchClient();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  if (!client) return <div className="text-center py-16 text-gray-400">Client not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
        <ArrowLeft size={16} />
        Back to Clients
      </button>

      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-text-main text-2xl">{client.company}</h2>
              {client.contact && <p className="text-gray-600 mt-0.5">{client.contact}</p>}
            </div>
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Edit2 size={14} />
            Edit
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: 'Email', value: client.email },
            { icon: Phone, label: 'Phone', value: client.phone },
            { icon: MapPin, label: 'Address', value: client.address },
          ].map(({ icon: Icon, label, value }) => (
            value ? (
              <div key={label} className="flex items-start gap-2">
                <Icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-800">{value}</p>
                </div>
              </div>
            ) : null
          ))}
        </div>

        {client.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700">{client.notes}</p>
          </div>
        )}

        {client.user_id && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-100">
              Client Portal Active
            </span>
          </div>
        )}
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader
          title="Projects"
          subtitle={`${client.projects?.length || 0} projects`}
          action={
            <Button size="sm" onClick={() => navigate('/projects')}>
              <FolderOpen size={14} />
              View All Projects
            </Button>
          }
        />
        {client.projects?.length === 0 ? (
          <p className="text-gray-400 text-sm">No projects yet.</p>
        ) : (
          <div className="space-y-2">
            {client.projects?.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50
                           cursor-pointer transition-colors border border-transparent hover:border-primary-100"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                  {p.deadline && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Due {new Date(p.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Client">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Company Name *" value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} required />
            </div>
            <Input label="Contact" value={editForm.contact} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} />
            <Input label="Email" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            <Input label="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
            <div className="col-span-2">
              <Input label="Address" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3} className="input-field resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)} type="button">Cancel</Button>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientDetailPage;
