import React, { useEffect, useState } from 'react';
import { Plus, FileText, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';

const InvoiceForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({ project_id: '', client_id: '', invoice_no: `INV-${Date.now()}`, amount: '', status: 'draft', issued_date: new Date().toISOString().split('T')[0], due_date: '', notes: '' });
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/clients')]).then(([p, c]) => {
      setProjects(p.data);
      setClients(c.data);
    }).catch(() => {});
  }, []);

  const handleProjectChange = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setForm(prev => ({ ...prev, project_id: projectId, client_id: project?.client_id || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/invoices', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <Select label="Project *" value={form.project_id} onChange={e => handleProjectChange(e.target.value)}
        options={projects.map(p => ({ value: p.id, label: `${p.title} (${p.client_name})` }))} placeholder="Select project..." required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Invoice No *" value={form.invoice_no} onChange={e => setForm({ ...form, invoice_no: e.target.value })} required />
        <Input label="Amount ($) *" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
        <Input label="Issued Date" type="date" value={form.issued_date} onChange={e => setForm({ ...form, issued_date: e.target.value })} />
        <Input label="Due Date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
        <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[
          { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' },
          { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' },
        ]} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="input-field resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>Create Invoice</Button>
      </div>
    </form>
  );
};

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/invoices/${id}`, { status: 'paid' });
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
    } catch (err) { console.error(err); }
  };

  const filtered = statusFilter ? invoices.filter(i => i.status === statusFilter) : invoices;
  const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
  const unpaid = invoices.filter(i => ['sent', 'overdue'].includes(i.status));

  const columns = [
    { key: 'invoice_no', header: 'Invoice #', render: (i) => <span className="font-mono font-medium text-gray-800">{i.invoice_no}</span> },
    { key: 'client_name', header: 'Client' },
    { key: 'project_title', header: 'Project', render: (i) => <span className="truncate max-w-[150px] block">{i.project_title}</span> },
    { key: 'amount', header: 'Amount', render: (i) => <span className="font-semibold text-gray-800">${Number(i.amount).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (i) => <Badge status={i.status} /> },
    { key: 'due_date', header: 'Due Date', render: (i) => i.due_date ? new Date(i.due_date).toLocaleDateString() : '—' },
    {
      key: 'actions',
      header: '',
      render: (i) => i.status !== 'paid' ? (
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleMarkPaid(i.id); }}>
          Mark Paid
        </Button>
      ) : <span className="text-xs text-green-600 font-medium">Paid</span>,
    },
  ];

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-text-main text-xl">Invoices</h2>
          <p className="text-gray-500 text-sm">{invoices.length} total invoices</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} /> New Invoice</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Revenue Collected" value={`$${revenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard label="Awaiting Payment" value={unpaid.length} icon={FileText} color={unpaid.length > 0 ? 'red' : 'green'} subtext={`$${unpaid.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()} outstanding`} />
        <StatCard label="Total Invoices" value={invoices.length} icon={FileText} color="primary" />
      </div>

      <Card>
        <CardHeader
          title="All Invoices"
          action={
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              options={[{ value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' }, { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' }]}
              placeholder="All statuses" className="w-36 text-sm" />
          }
        />
        <Table columns={columns} data={filtered} emptyMessage="No invoices found." />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Invoice" size="lg">
        <InvoiceForm onSuccess={() => { setShowModal(false); fetchInvoices(); }} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};

export default InvoicesPage;
