import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar, DollarSign } from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

const statusTabs = ['all', 'todo', 'in_progress', 'on_hold', 'completed', 'cancelled'];

const ProjectForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({ client_id: '', title: '', description: '', status: 'todo', start_date: '', deadline: '', budget: '' });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/clients').then(({ data }) => setClients(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/projects', form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <Select
        label="Client *"
        value={form.client_id}
        onChange={e => setForm({ ...form, client_id: e.target.value })}
        options={clients.map(c => ({ value: c.id, label: c.company }))}
        placeholder="Select client..."
        required
      />
      <Input label="Project Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[
          { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' },
          { value: 'on_hold', label: 'On Hold' }, { value: 'completed', label: 'Completed' },
        ]} />
        <Input label="Budget ($)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
        <Input label="Start Date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
        <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>Create Project</Button>
      </div>
    </form>
  );
};

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { isManagerOrAdmin } = useRole();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = tab === 'all' ? projects : projects.filter(p => p.status === tab);

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-text-main text-xl">Projects</h2>
          <p className="text-gray-500 text-sm">{projects.length} total</p>
        </div>
        {isManagerOrAdmin && (
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New Project
          </Button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((s) => {
          const count = s === 'all' ? projects.length : projects.filter(p => p.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                tab === s
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <span className={`ml-1.5 text-xs ${tab === s ? 'text-primary-200' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'completed';
          return (
            <Card
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen size={18} className="text-primary" />
                </div>
                <Badge status={project.status} />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 text-sm leading-snug mt-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{project.client_name}</p>
              {project.description && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{project.description}</p>
              )}
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                {project.deadline ? (
                  <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                    <Calendar size={11} />
                    {isOverdue ? 'Overdue · ' : ''}
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                ) : <span />}
                {project.budget && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <DollarSign size={11} />
                    {Number(project.budget).toLocaleString()}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No {tab !== 'all' ? tab.replace('_', ' ') : ''} projects found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Project" size="lg">
        <ProjectForm onSuccess={() => { setShowModal(false); fetchProjects(); }} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};

export default ProjectsListPage;
