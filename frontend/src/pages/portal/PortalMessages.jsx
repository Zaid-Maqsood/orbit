import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const PortalMessages = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgRes, projRes] = await Promise.all([
          api.get(`/portal/messages/${projectId}`),
          api.get(`/portal/projects/${projectId}`),
        ]);
        setMessages(msgRes.data);
        setProjectTitle(projRes.data.title);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/portal/messages/${projectId}`, { body: message });
      setMessages(prev => [...prev, data]);
      setMessage('');
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-4 max-w-3xl flex flex-col h-[calc(100vh-10rem)]">
      <button onClick={() => navigate(`/portal/projects/${projectId}`)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
        <ArrowLeft size={16} /> Back to Project
      </button>

      <div className="bg-white rounded-xl shadow-card border border-gray-100 flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-text-main">{projectTitle}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Messages with your account team</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No messages yet. Start the conversation with your account team!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.sender_role === 'client' ? 'bg-cta text-white' : 'bg-primary text-white'
                  }`}>
                    <span className="text-xs font-bold">{m.sender_name?.[0]}</span>
                  </div>
                  <div className={`max-w-xs lg:max-w-md flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
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
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1"
            />
            <Button type="submit" loading={sending} disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortalMessages;
