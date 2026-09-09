import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
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
      <section className="min-h-[100svh] grid lg:grid-cols-2">
        {/* Visual — desktop only on the side, mobile gets a shorter band above the form */}
        <div className="relative h-[32vh] lg:h-auto order-1 lg:order-1 bg-[#241b13]">
          <img src={loginImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c150f]/70 via-[#1c150f]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#1c150f]/10 lg:to-[#1c150f]/60" />
        </div>

        {/* Form */}
        <div className="order-2 lg:order-2 flex items-center bg-ivory py-14 lg:py-0">
          <div className="mx-auto max-w-md w-full px-6 lg:px-14">
            <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">ABIXMART Account</span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl text-greendark leading-[1.05] tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-4 text-foreground/60 leading-relaxed">Continue your ABIXMART journey.</p>

            {error && (
              <div className="mt-6 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              <div>
                <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Email</label>
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
                  <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50">Password</label>
                  <Link to="/forgot-password" className="text-[11px] text-greendark/50 hover:text-gold transition-colors">
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

            <p className="mt-8 text-sm text-foreground/60">
              New to ABIXMART?{' '}
              <Link to="/create-account" className="text-greendark font-medium hover:text-gold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}