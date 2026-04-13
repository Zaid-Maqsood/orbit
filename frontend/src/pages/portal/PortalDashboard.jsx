import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const PortalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portal/projects')
      .then(({ data }) => setProjects(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-text-main text-2xl">
          Welcome, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Here is an overview of your projects and their current status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, color: 'bg-primary-50 border-primary-200 text-primary-700' },
          { label: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`border rounded-xl p-5 ${color}`}>
            <p className="font-heading font-bold text-3xl">{value}</p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <h3 className="font-heading font-semibold text-text-main text-lg mb-4">Your Projects</h3>
        {projects.length === 0 ? (
          <Card>
            <div className="text-center py-10 text-gray-400">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>No projects assigned yet. Your account manager will add projects soon.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                onClick={() => navigate(`/portal/projects/${project.id}`)}
                className="cursor-pointer group hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge status={project.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {project.deadline && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={11} />
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate(`/portal/messages/${project.id}`); }}
                      className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                    >
                      <MessageSquare size={11} />
                      Messages
                    </span>
                  </div>
                  <ArrowRight size={15} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDashboard;
