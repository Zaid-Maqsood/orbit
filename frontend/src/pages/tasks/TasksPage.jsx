import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Calendar, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import Table from '../../components/ui/Table';

const TasksPage = () => {
  const navigate = useNavigate();
  const { isManagerOrAdmin, isEmployee } = useRole();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get('/tasks')
      .then(({ data }) => setTasks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;

  const columns = [
    {
      key: 'title',
      header: 'Task',
      render: (t) => (
        <div>
          <p className="font-medium text-gray-800">{t.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t.project_title}</p>
        </div>
      ),
    },
    { key: 'assignee_name', header: 'Assignee', render: (t) => t.assignee_name || '—' },
    { key: 'priority', header: 'Priority', render: (t) => <Badge status={t.priority} /> },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (t) => {
        if (!t.due_date) return '—';
        const overdue = new Date(t.due_date) < new Date() && t.status !== 'done';
        return (
          <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {overdue && <AlertTriangle size={12} />}
            {new Date(t.due_date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <select
          value={t.status}
          onChange={(e) => handleStatusUpdate(t.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  const overdueCnt = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-text-main text-xl">
          {isEmployee ? 'My Tasks' : 'All Tasks'}
        </h2>
        <p className="text-gray-500 text-sm">
          {tasks.length} total{overdueCnt > 0 ? ` · ${overdueCnt} overdue` : ''}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'To Do', status: 'todo', color: 'text-gray-600 bg-gray-50 border-gray-200' },
          { label: 'In Progress', status: 'in_progress', color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Done', status: 'done', color: 'text-green-600 bg-green-50 border-green-200' },
        ].map(({ label, status, color }) => (
          <div
            key={status}
            onClick={() => setStatusFilter(prev => prev === status ? '' : status)}
            className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 hover:shadow-sm ${color}
                        ${statusFilter === status ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
          >
            <p className="font-heading font-bold text-2xl">
              {tasks.filter(t => t.status === status).length}
            </p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Tasks"
          action={
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
              placeholder="All statuses"
              className="w-36 text-sm"
            />
          }
        />
        <Table
          columns={columns}
          data={filtered}
          onRowClick={(t) => navigate(`/projects/${t.project_id}`)}
          emptyMessage="No tasks found."
        />
      </Card>
    </div>
  );
};

export default TasksPage;
