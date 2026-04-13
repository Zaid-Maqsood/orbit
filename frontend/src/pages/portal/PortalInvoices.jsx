import React, { useEffect, useState } from 'react';
import { FileText, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Table from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';

const PortalInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portal/invoices')
      .then(({ data }) => setInvoices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const paid = invoices.filter(i => i.status === 'paid');
  const unpaid = invoices.filter(i => ['sent', 'overdue'].includes(i.status));

  const columns = [
    { key: 'invoice_no', header: 'Invoice #', render: (i) => <span className="font-mono font-medium text-gray-800">{i.invoice_no}</span> },
    { key: 'project_title', header: 'Project' },
    { key: 'amount', header: 'Amount', render: (i) => <span className="font-semibold text-gray-900">${Number(i.amount).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (i) => <Badge status={i.status} /> },
    { key: 'issued_date', header: 'Issued', render: (i) => new Date(i.issued_date).toLocaleDateString() },
    { key: 'due_date', header: 'Due Date', render: (i) => i.due_date ? new Date(i.due_date).toLocaleDateString() : '—' },
  ];

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-text-main text-xl">Invoices</h2>
        <p className="text-gray-500 text-sm">Your billing history and payment status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Paid"
          value={`$${paid.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          label="Outstanding"
          value={`$${unpaid.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()}`}
          icon={FileText}
          color={unpaid.length > 0 ? 'red' : 'green'}
          subtext={`${unpaid.length} awaiting payment`}
        />
        <StatCard label="Total Invoices" value={invoices.length} icon={FileText} color="primary" />
      </div>

      <Card>
        <CardHeader title="All Invoices" />
        <Table columns={columns} data={invoices} emptyMessage="No invoices yet." />
      </Card>
    </div>
  );
};

export default PortalInvoices;
