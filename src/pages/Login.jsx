import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
import AuthShell from '@/components/abix/AuthShell';
import { useAuth } from '@/lib/AuthContext';
import { mapAuthError } from '@/lib/authErrors';
import loginImage from '@/assets/authentication/login.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/account');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell
        image={loginImage}
        imageAlt=""
        eyebrow="ABIXMART Account"
        title="Welcome Back"
        subtitle="Continue your ABIXMART journey."
        footer={
          <>
            New to ABIXMART?{' '}
            <Link to="/create-account" className="text-resin font-medium hover:text-charcoal transition-colors">
              Create Account
            </Link>
          </>
        }
      >
        {error && (
          <div className="mb-5 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-2.5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block label-meta text-charcoal/50 mb-1">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="express-input"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block label-meta text-charcoal/50">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-charcoal/50 hover:text-resin transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="express-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging In…' : 'Login'}
          </button>
        </form>
      </AuthShell>
    </PageTransition>
  );
}