import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link, Calendar, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const statusSteps = ['todo', 'in_progress', 'on_hold', 'completed'];

const PortalProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/portal/projects/${id}`)
      .then(({ data }) => setProject(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;
  if (!project) return <div className="text-center py-16 text-gray-400">Project not found.</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate('/portal')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
        <ArrowLeft size={16} /> Back to My Projects
      </button>

      {/* Project Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-heading font-bold text-text-main text-2xl">{project.title}</h2>
              <Badge status={project.status} />
            </div>
            {project.description && <p className="text-gray-600 text-sm mt-3">{project.description}</p>}
          </div>
        </div>
        {project.deadline && (
          <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar size={15} className="text-gray-400" />
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </div>
        )}

        {/* Status Timeline */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 font-medium mb-3">Project Progress</p>
          <div className="flex items-center gap-2">
            {statusSteps.map((step, i) => {
              const idx = statusSteps.indexOf(project.status);
              const isActive = step === project.status;
              const isPast = i < idx;
              return (
                <React.Fragment key={step}>
                  <div className={`flex-shrink-0 flex flex-col items-center`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive ? 'bg-primary text-white ring-4 ring-primary-100' :
                      isPast ? 'bg-green-500 text-white' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isPast ? '✓' : i + 1}
                    </div>
                    <p className={`text-xs mt-1 whitespace-nowrap ${isActive ? 'text-primary font-medium' : isPast ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader title="Deliverables" subtitle="Files and documents shared with you" />
        {project.deliverables?.length === 0 ? (
          <p className="text-gray-400 text-sm">No deliverables have been shared yet.</p>
        ) : (
          <div className="space-y-2">
            {project.deliverables?.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary-200
                           hover:bg-primary-50 transition-colors cursor-pointer"
              >
                <Link size={16} className="text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{d.name}</p>
                  <p className="text-xs text-gray-500 truncate">{d.url}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-auto">
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </a>
            ))}
          </div>
        )}
      </Card>

      {/* Message link */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Project Messages</p>
              <p className="text-xs text-gray-500">{project.messages?.length || 0} messages with your account team</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate(`/portal/messages/${id}`)}>
            View Messages
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PortalProjectDetail;
