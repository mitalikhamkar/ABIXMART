import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';

/**
 * Frontend-only prototype — no backend/auth. Demonstrates the future
 * account journey for founder review. Submitting shows a small success
 * state; nothing is actually authenticated or stored.
 */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <section className="min-h-[100svh] bg-sand flex items-center py-28 lg:py-0">
        <div className="mx-auto max-w-md w-full px-6 lg:px-10">
          <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">ABIXMART Account</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl text-greendark leading-[1.05] tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-4 text-foreground/60 leading-relaxed">Continue your ABIXMART journey.</p>

          {submitted ? (
            <div className="mt-10 border border-greendark/15 bg-ivory p-6">
              <p className="text-greendark leading-relaxed">
                Your ABIXMART account experience is coming together.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="express-input"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="express-input"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300"
              >
                Login
              </button>
            </form>
          )}

          <p className="mt-8 text-sm text-foreground/60">
            New to ABIXMART?{' '}
            <Link to="/create-account" className="text-greendark font-medium hover:text-gold transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}