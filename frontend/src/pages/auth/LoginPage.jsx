import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Deterministic star field using golden-angle distribution
const STARS = Array.from({ length: 90 }, (_, i) => ({
  top:  `${((i * 137.508) % 100).toFixed(2)}%`,
  left: `${((i * 97.35)  % 100).toFixed(2)}%`,
  size: i % 9 === 0 ? '2px' : '1px',
  anim: ['twinkle-a', 'twinkle-b', 'twinkle-c'][i % 3],
  dur:  `${2.4 + (i % 5) * 0.7}s`,
  del:  `${(i * 0.31) % 5}s`,
}));

const DEMO_USERS = [
  { role: 'Admin',    email: 'admin@itfirm.com' },
  { role: 'Manager', email: 'sarah.manager@itfirm.com' },
  { role: 'Employee', email: 'dev1@itfirm.com' },
  { role: 'Client',  email: 'cto@acmecorp.com' },
];

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    navigate(user.role === 'client' ? '/portal' : '/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'client' ? '/portal' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Global styles for this page ──────────────────────────── */}
      <style>{`
        /* Star twinkle variants */
        @keyframes twinkle-a { 0%,100%{opacity:.12} 50%{opacity:.65} }
        @keyframes twinkle-b { 0%,100%{opacity:.06} 50%{opacity:.45} }
        @keyframes twinkle-c { 0%,100%{opacity:.18} 50%{opacity:.9}  }

        /* Ring animations */
        @keyframes ring-cw  {
          from { transform: rotateX(76deg) rotateZ(0deg);   }
          to   { transform: rotateX(76deg) rotateZ(360deg); }
        }
        @keyframes ring-ccw {
          from { transform: rotateX(76deg) rotateZ(0deg);    }
          to   { transform: rotateX(76deg) rotateZ(-360deg); }
        }
        @keyframes ring-cw2 {
          from { transform: rotateX(72deg) rotateZ(60deg);   }
          to   { transform: rotateX(72deg) rotateZ(420deg);  }
        }

        /* Core glow */
        @keyframes core-pulse {
          0%,100% {
            transform: translate(-50%,-50%) scale(1);
            box-shadow:
              0 0 0 0 rgba(99,102,241,0),
              0 0 18px 6px rgba(99,102,241,.55),
              0 0 55px 18px rgba(99,102,241,.18);
          }
          50% {
            transform: translate(-50%,-50%) scale(1.25);
            box-shadow:
              0 0 0 6px rgba(99,102,241,.08),
              0 0 28px 10px rgba(99,102,241,.75),
              0 0 80px 30px rgba(99,102,241,.28);
          }
        }

        /* Nebula drift */
        @keyframes drift-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(45px,-35px) scale(1.1); }
          70%      { transform: translate(-25px,25px) scale(.95); }
        }
        @keyframes drift-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          35%      { transform: translate(-55px,40px) scale(1.08); }
          70%      { transform: translate(30px,-20px) scale(.93); }
        }
        @keyframes drift-3 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px,-40px); }
        }

        /* Card entrance */
        @keyframes card-rise {
          from { opacity:0; transform: translateY(36px) scale(.97); }
          to   { opacity:1; transform: translateY(0)    scale(1);   }
        }

        /* Spinner */
        @keyframes btn-spin { to { transform: rotate(360deg); } }
        .btn-spin { animation: btn-spin .75s linear infinite; }

        /* ── Orbital scene ───────────────────────────────────────── */
        .orb-scene {
          position: absolute;
          inset: 0;
          pointer-events: none;
          perspective: 1100px;
          overflow: hidden;
        }
        .orb-anchor {
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          transform-style: preserve-3d;
        }
        .orb-plane {
          position: absolute;
          top: 0; left: 0;
          transform-style: preserve-3d;
        }
        .orb-ring {
          position: absolute;
          border-radius: 50%;
        }
        /* Ring sizes & colours */
        .r1 {
          width: 580px; height: 580px;
          top: -290px;  left: -290px;
          border: 1.5px solid rgba(99,102,241,.42);
          box-shadow: 0 0 14px rgba(99,102,241,.18), inset 0 0 16px rgba(99,102,241,.06);
          animation: ring-cw 30s linear infinite;
        }
        .r2 {
          width: 410px; height: 410px;
          top: -205px;  left: -205px;
          border: 1.5px solid rgba(167,139,250,.38);
          box-shadow: 0 0 12px rgba(167,139,250,.15);
          animation: ring-ccw 20s linear infinite;
        }
        .r3 {
          width: 255px; height: 255px;
          top: -127px;  left: -128px;
          border: 1.5px solid rgba(34,211,238,.42);
          box-shadow: 0 0 12px rgba(34,211,238,.18);
          animation: ring-cw2 13s linear infinite;
        }

        /* Planets (top edge of each ring) */
        .planet {
          position: absolute;
          border-radius: 50%;
          left: 50%;
        }
        .planet-1 {
          width: 11px; height: 11px;
          top: -5.5px;  margin-left: -5.5px;
          background: radial-gradient(circle at 35% 30%, #c7d2fe, #6366f1);
          box-shadow: 0 0 10px 4px rgba(99,102,241,.8);
        }
        .planet-2 {
          width: 9px; height: 9px;
          top: -4.5px; margin-left: -4.5px;
          background: radial-gradient(circle at 35% 30%, #e9d5ff, #a855f7);
          box-shadow: 0 0 10px 3px rgba(168,85,247,.8);
        }
        .planet-3 {
          width: 7px; height: 7px;
          top: -3.5px; margin-left: -3.5px;
          background: radial-gradient(circle at 35% 30%, #a5f3fc, #06b6d4);
          box-shadow: 0 0 8px 3px rgba(6,182,212,.8);
        }

        /* Central core */
        .orb-core {
          position: absolute;
          width: 22px; height: 22px;
          top: 50%; left: 50%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #e0e7ff, #6366f1 55%, #3730a3);
          animation: core-pulse 3.8s ease-in-out infinite;
          z-index: 4;
        }

        /* Nebula */
        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        /* ── Login card ──────────────────────────────────────────── */
        .login-card {
          animation: card-rise .85s cubic-bezier(.16,1,.3,1) both;
          background: rgba(10,17,35,.72);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(99,102,241,.18);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.04),
            0 30px 60px rgba(0,0,0,.55),
            0 0 100px rgba(99,102,241,.07);
        }

        /* Input */
        .orbit-input {
          width: 100%;
          padding: .6rem .875rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: .5rem;
          color: #fff;
          font-size: .875rem;
          font-family: inherit;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          box-sizing: border-box;
        }
        .orbit-input::placeholder { color: rgba(255,255,255,.28); }
        .orbit-input:focus {
          border-color: rgba(99,102,241,.65);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }

        /* Submit button */
        .orbit-btn {
          width: 100%;
          padding: .7rem 1rem;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          border: none;
          border-radius: .5rem;
          font-weight: 600;
          font-size: .9rem;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          letter-spacing: .01em;
          transition: all .2s;
        }
        .orbit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e40af, #1d4ed8);
          box-shadow: 0 4px 24px rgba(29,78,216,.45);
          transform: translateY(-1px);
        }
        .orbit-btn:active:not(:disabled)  { transform: translateY(0); }
        .orbit-btn:disabled { opacity: .65; cursor: not-allowed; }

        /* Demo pills */
        .demo-pill {
          padding: .5rem .7rem;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: .5rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background .15s, border-color .15s;
          font-family: inherit;
        }
        .demo-pill:hover {
          background: rgba(99,102,241,.14);
          border-color: rgba(99,102,241,.32);
        }
      `}</style>

      {/* ── Page shell ───────────────────────────────────────────── */}
      <div style={{
        minHeight: '100vh',
        background: '#020817',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Nebula blobs ─────────────────────────────────────── */}
        <div className="nebula" style={{
          width: 650, height: 520,
          top: '8%', left: '12%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,.17) 0%, transparent 70%)',
          animation: 'drift-1 20s ease-in-out infinite',
        }} />
        <div className="nebula" style={{
          width: 520, height: 420,
          bottom: '6%', right: '8%',
          background: 'radial-gradient(ellipse, rgba(168,85,247,.14) 0%, transparent 70%)',
          animation: 'drift-2 25s ease-in-out infinite',
        }} />
        <div className="nebula" style={{
          width: 320, height: 320,
          top: '35%', right: '25%',
          background: 'radial-gradient(ellipse, rgba(6,182,212,.1) 0%, transparent 70%)',
          animation: 'drift-3 16s ease-in-out infinite 4s',
        }} />

        {/* ── Star field ───────────────────────────────────────── */}
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#fff',
            animation: `${s.anim} ${s.dur} ease-in-out infinite ${s.del}`,
          }} />
        ))}

        {/* ── Orbital system ───────────────────────────────────── */}
        <div className="orb-scene">
          <div className="orb-anchor">
            {/* Plane 0 – 0° Y */}
            <div className="orb-plane" style={{ transform: 'rotateY(0deg)' }}>
              <div className="orb-ring r1">
                <div className="planet planet-1" />
              </div>
            </div>
            {/* Plane 1 – 65° Y */}
            <div className="orb-plane" style={{ transform: 'rotateY(65deg)' }}>
              <div className="orb-ring r2">
                <div className="planet planet-2" />
              </div>
            </div>
            {/* Plane 2 – 130° Y */}
            <div className="orb-plane" style={{ transform: 'rotateY(130deg)' }}>
              <div className="orb-ring r3">
                <div className="planet planet-3" />
              </div>
            </div>
            {/* Core */}
            <div className="orb-core" />
          </div>
        </div>

        {/* ── Login card ───────────────────────────────────────── */}
        <div className="login-card" style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '420px',
          borderRadius: '1.25rem',
          padding: '2.25rem 2rem',
        }}>

          {/* Brand — inline planet-O wordmark */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.6rem',
            }}>
              {/* Planet replaces the "O" */}
              <svg
                viewBox="0 0 64 48"
                style={{ height: '54px', width: 'auto', flexShrink: 0 }}
                fill="none"
              >
                <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="1.3" />
                <ellipse cx="27" cy="26" rx="27" ry="9"
                  stroke="white" strokeWidth="1.3"
                  transform="rotate(-18 27 26)" />
                <circle cx="52" cy="12" r="2" fill="white" />
              </svg>
              {/* "rbit" */}
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 300,
                fontSize: '54px',
                color: 'white',
                letterSpacing: '0.04em',
                lineHeight: 1,
                marginLeft: '-17px',
              }}>rbit</span>
            </div>
            <p style={{ color: 'rgba(148,163,184,.65)', fontSize: '.82rem', margin: 0 }}>
              Project Management Platform
            </p>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,.92)',
              margin: '0 0 4px',
            }}>
              Welcome back
            </h2>
            <p style={{ color: 'rgba(148,163,184,.65)', fontSize: '.85rem', margin: 0 }}>
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '.7rem 1rem',
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.25)',
              borderRadius: '.5rem',
              color: '#fca5a5',
              fontSize: '.85rem',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(203,213,225,.85)', fontSize: '.78rem', fontWeight: 500, marginBottom: 6 }}>
                Email address
              </label>
              <input
                className="orbit-input"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', color: 'rgba(203,213,225,.85)', fontSize: '.78rem', fontWeight: 500, marginBottom: 6 }}>
                Password
              </label>
              <input
                className="orbit-input"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 12, top: 34,
                  background: 'none', border: 'none', padding: 0,
                  color: 'rgba(148,163,184,.55)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  transition: 'color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(148,163,184,1)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,.55)'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button
              type="submit"
              className="orbit-btn"
              disabled={loading}
              style={{ marginTop: '.25rem' }}
            >
              {loading && <Loader2 size={15} className="btn-spin" />}
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,.06)',
          }}>
            <p style={{
              textAlign: 'center',
              color: 'rgba(148,163,184,.55)',
              fontSize: '.72rem',
              fontWeight: 500,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
              marginBottom: '.75rem',
            }}>
              Quick Access — Demo Accounts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
              {DEMO_USERS.map(({ role, email }) => (
                <button
                  key={role}
                  type="button"
                  className="demo-pill"
                  onClick={() => setForm({ email, password: 'Admin@1234' })}
                >
                  <span style={{ display: 'block', color: '#a5b4fc', fontWeight: 600, fontSize: '.75rem' }}>
                    {role}
                  </span>
                  <span style={{
                    display: 'block',
                    color: 'rgba(148,163,184,.55)',
                    fontSize: '.68rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: 1,
                  }}>
                    {email}
                  </span>
                </button>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(100,116,139,.6)', fontSize: '.68rem', marginTop: '.6rem' }}>
              Password: <span style={{ color: 'rgba(148,163,184,.5)', fontFamily: 'monospace' }}>Admin@1234</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
