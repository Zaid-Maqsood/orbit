import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, FolderOpen, CheckSquare, FileText,
  AlertTriangle, TrendingUp, Clock, DollarSign,
} from 'lucide-react';
import api from '../../api/axios';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const DashboardPage = () => {
  const { isManagerOrAdmin, isEmployee } = useRole();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
        ]);
        setProjects(projectsRes.data.slice(0, 5));
        setTasks(tasksRes.data.slice(0, 5));

        if (isManagerOrAdmin) {
          const statsRes = await api.get('/stats/overview');
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isManagerOrAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-heading font-bold text-text-main text-2xl">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats — Manager/Admin only */}
      {isManagerOrAdmin && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Clients"
            value={stats.totalClients}
            icon={Building2}
            color="primary"
          />
          <StatCard
            label="Active Projects"
            value={stats.projects.in_progress}
            icon={FolderOpen}
            color="blue"
            subtext={`${stats.projects.total} total`}
          />
          <StatCard
            label="Open Tasks"
            value={stats.tasks.open}
            icon={CheckSquare}
            color="orange"
            subtext={stats.tasks.overdue > 0 ? `${stats.tasks.overdue} overdue` : 'All on track'}
          />
          <StatCard
            label="Awaiting Payment"
            value={stats.invoices.unpaid}
            icon={FileText}
            color={stats.invoices.unpaid > 0 ? 'red' : 'green'}
            subtext={`$${stats.invoices.revenue.toLocaleString()} collected`}
          />
        </div>
      )}

      {/* Employee stats */}
      {isEmployee && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="My Projects" value={projects.length} icon={FolderOpen} color="primary" />
          <StatCard
            label="Open Tasks"
            value={tasks.filter(t => t.status !== 'done').length}
            icon={CheckSquare}
            color="blue"
          />
          <StatCard
            label="Overdue Tasks"
            value={tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date()).length}
            icon={AlertTriangle}
            color="red"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader
            title="Recent Projects"
            action={
              <button
                onClick={() => navigate('/projects')}
                className="text-sm text-primary font-medium hover:underline cursor-pointer"
              >
                View all
              </button>
            }
          />
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-gray-400 text-sm">No projects yet.</p>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50
                             cursor-pointer transition-colors duration-150 border border-transparent
                             hover:border-primary-100"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.client_name}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <Badge status={p.status} />
                    {p.deadline && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(p.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader
            title={isEmployee ? 'My Tasks' : 'Recent Tasks'}
            action={
              <button
                onClick={() => navigate('/tasks')}
                className="text-sm text-primary font-medium hover:underline cursor-pointer"
              >
                View all
              </button>
            }
          />
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks assigned.</p>
            ) : (
              tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{t.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.project_title}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <Badge status={t.priority} />
                    <Badge status={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
