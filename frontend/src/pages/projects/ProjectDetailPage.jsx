import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, Users, Plus, Edit2,
  Paperclip, Link, Send, Trash2, UserPlus,
} from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card, { CardHeader } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

// ─── Kanban Board ───────────────────────────────────────────────
const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const KanbanBoard = ({ tasks, onStatusChange, onDelete, canManage }) => {
  const [dragging, setDragging] = useState(null);

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, status) => {
    e.preventDefault();
    if (dragging && dragging.status !== status) {
      onStatusChange(dragging.id, status);
    }
    setDragging(null);
  };

  const colColors = { todo: 'bg-gray-50 border-gray-200', in_progress: 'bg-blue-50 border-blue-200', done: 'bg-green-50 border-green-200' };
  const headerColors = { todo: 'text-gray-700', in_progress: 'text-blue-700', done: 'text-green-700' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ key, label }) => {
        const colTasks = tasks.filter(t => t.status === key);
        return (
          <div
            key={key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, key)}
            className={`rounded-xl border-2 border-dashed ${colColors[key]} min-h-[200px] p-3`}
          >
            <div className={`flex items-center justify-between mb-3`}>
              <h4 className={`font-heading font-semibold text-sm ${headerColors[key]}`}>{label}</h4>
              <span className="text-xs bg-white border border-gray-200 text-gray-500 rounded-full px-2 py-0.5">
                {colTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDragging(task)}
                  onDragEnd={() => setDragging(null)}
                  className={`bg-white rounded-lg border border-gray-100 p-3 shadow-sm cursor-grab active:cursor-grabbing
                              hover:shadow-card-hover transition-shadow duration-150
                              ${dragging?.id === task.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
                    {canManage && (
                      <button
                        onClick={() => onDelete(task.id)}
                        className="text-gray-300 hover:text-red-500 cursor-pointer flex-shrink-0 transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Badge status={task.priority} />
                    </div>
                    {task.assignee_name && (
                      <span className="text-xs text-gray-400 truncate max-w-[80px]">{task.assignee_name}</span>
                    )}
                  </div>
                  {task.due_date && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Task Form ──────────────────────────────────────────────────
const TaskForm = ({ projectId, members, onSuccess, onClose }) => {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', assigned_to: '', due_date: '', status: 'todo' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tasks', { ...form, project_id: projectId });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <Input label="Task Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={[
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' },
        ]} />
        <Select label="Assign To" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}
          options={members.map(m => ({ value: m.id, label: m.name }))} placeholder="Unassigned" />
        <Input label="Due Date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
        <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[
          { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' }, { value: 'done', label: 'Done' },
        ]} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>Create Task</Button>
      </div>
    </form>
  );
};

// ─── Main Page ──────────────────────────────────────────────────
const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManagerOrAdmin } = useRole();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [delivForm, setDelivForm] = useState({ name: '', url: '' });
  const [addDelivModal, setAddDelivModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      setEditForm({ title: data.title, description: data.description || '', status: data.status, deadline: data.deadline?.split('T')[0] || '', budget: data.budget || '', start_date: data.start_date?.split('T')[0] || '' });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProject(); }, [id]);

  useEffect(() => {
    if (isManagerOrAdmin) {
      api.get('/users').then(({ data }) => setAllUsers(data)).catch(() => {});
    }
  }, [isManagerOrAdmin]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setProject(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status } : t) }));
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setProject(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/projects/${id}/messages`, { body: message });
      setProject(prev => ({ ...prev, messages: [...prev.messages, data] }));
      setMessage('');
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleAddDeliverable = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/projects/${id}/deliverables`, delivForm);
      setProject(prev => ({ ...prev, deliverables: [data, ...prev.deliverables] }));
      setDelivForm({ name: '', url: '' });
      setAddDelivModal(false);
    } catch (err) { console.error(err); }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await api.post(`/projects/${id}/members`, { user_id: selectedUser });
      setMemberModal(false);
      setSelectedUser('');
      fetchProject();
    } catch (err) { console.error(err); }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, editForm);
      setEditModal(false);
      fetchProject();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  if (!project) return <div className="text-center py-16 text-gray-400">Project not found.</div>;

  const nonMembers = allUsers.filter(u => !project.members?.some(m => m.id === u.id));

  return (
    <div className="space-y-6 max-w-6xl">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-heading font-bold text-text-main text-2xl">{project.title}</h2>
              <Badge status={project.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">{project.client_name}</p>
            {project.description && <p className="text-gray-600 text-sm mt-3">{project.description}</p>}
          </div>
          {isManagerOrAdmin && (
            <Button variant="secondary" size="sm" onClick={() => setEditModal(true)} className="ml-4 flex-shrink-0">
              <Edit2 size={14} /> Edit
            </Button>
          )}
        </div>
        <div className="mt-4 flex items-center gap-6 flex-wrap">
          {project.deadline && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={15} className="text-gray-400" />
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </div>
          )}
          {project.budget && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <DollarSign size={15} className="text-gray-400" />
              Budget: ${Number(project.budget).toLocaleString()}
            </div>
          )}
          {project.created_by_name && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Users size={15} className="text-gray-400" />
              Lead: {project.created_by_name}
            </div>
          )}
        </div>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader
          title="Team Members"
          action={
            isManagerOrAdmin && (
              <Button size="sm" variant="secondary" onClick={() => setMemberModal(true)}>
                <UserPlus size={14} /> Add Member
              </Button>
            )
          }
        />
        <div className="flex flex-wrap gap-3">
          {project.members?.length === 0 ? (
            <p className="text-gray-400 text-sm">No members assigned.</p>
          ) : (
            project.members?.map((m) => (
              <div key={m.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{m.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.name}</p>
                  <Badge status={m.role} className="text-xs" />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Kanban Tasks */}
      <Card>
        <CardHeader
          title="Tasks"
          subtitle={`${project.tasks?.length || 0} tasks`}
          action={
            isManagerOrAdmin && (
              <Button size="sm" onClick={() => setTaskModal(true)}>
                <Plus size={14} /> Add Task
              </Button>
            )
          }
        />
        <KanbanBoard
          tasks={project.tasks || []}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
          canManage={isManagerOrAdmin}
        />
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader
          title="Deliverables"
          action={
            isManagerOrAdmin && (
              <Button size="sm" variant="secondary" onClick={() => setAddDelivModal(true)}>
                <Paperclip size={14} /> Add Link
              </Button>
            )
          }
        />
        {project.deliverables?.length === 0 ? (
          <p className="text-gray-400 text-sm">No deliverables yet.</p>
        ) : (
          <div className="space-y-2">
            {project.deliverables?.map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Link size={15} className="text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">{d.name}</p>
                  <a href={d.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block cursor-pointer">
                    {d.url}
                  </a>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{d.uploaded_by_name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader title="Messages" />
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
          {project.messages?.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
          ) : (
            project.messages?.map((m) => {
              const isMe = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.sender_role === 'client' ? 'bg-orange-100 text-orange-600' : 'bg-primary-100 text-primary'
                  }`}>
                    <span className="text-xs font-semibold">{m.sender_name?.[0]}</span>
                  </div>
                  <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : ''} flex flex-col`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {m.body}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">
                      {m.sender_name} · {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="input-field flex-1"
          />
          <Button type="submit" loading={sending} disabled={!message.trim()}>
            <Send size={15} />
          </Button>
        </form>
      </Card>

      {/* Modals */}
      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title="New Task" size="lg">
        <TaskForm projectId={id} members={project.members || []} onSuccess={() => { setTaskModal(false); fetchProject(); }} onClose={() => setTaskModal(false)} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Project" size="lg">
        <form onSubmit={handleEditSave} className="space-y-4">
          <Input label="Title *" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Status" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} options={[
              { value: 'todo', label: 'To Do' }, { value: 'in_progress', label: 'In Progress' },
              { value: 'on_hold', label: 'On Hold' }, { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' },
            ]} />
            <Input label="Budget ($)" type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: e.target.value })} />
            <Input label="Start Date" type="date" value={editForm.start_date} onChange={e => setEditForm({ ...editForm, start_date: e.target.value })} />
            <Input label="Deadline" type="date" value={editForm.deadline} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModal(false)} type="button">Cancel</Button>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={addDelivModal} onClose={() => setAddDelivModal(false)} title="Add Deliverable">
        <form onSubmit={handleAddDeliverable} className="space-y-4">
          <Input label="Name *" value={delivForm.name} onChange={e => setDelivForm({ ...delivForm, name: e.target.value })} required placeholder="e.g. Design Files (Figma)" />
          <Input label="URL *" value={delivForm.url} onChange={e => setDelivForm({ ...delivForm, url: e.target.value })} required placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAddDelivModal(false)} type="button">Cancel</Button>
            <Button type="submit">Add Deliverable</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="Add Team Member">
        <div className="space-y-4">
          <Select label="Team Member" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
            options={nonMembers.filter(u => u.role !== 'client').map(u => ({ value: u.id, label: `${u.name} (${u.role})` }))}
            placeholder="Select member..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setMemberModal(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!selectedUser}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
