import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';

/**
 * Frontend-only prototype — no backend/auth. Demonstrates the future
 * account journey for founder review. Submitting shows a small success
 * state; nothing is actually created or stored.
 */
export default function CreateAccount() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
            Create Your ABIXMART Account
          </h1>
          <p className="mt-4 text-foreground/60 leading-relaxed">
            Save your preferences, track your orders and stay connected with ABIXMART.
          </p>

          {submitted ? (
            <div className="mt-10 border border-greendark/15 bg-ivory p-6">
              <p className="text-greendark leading-relaxed">
                Your ABIXMART account experience is coming together.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="express-input"
                />
              </div>
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
              <div>
                <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="express-input"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300"
              >
                Create Account
              </button>
            </form>
          )}

          <p className="mt-8 text-sm text-foreground/60">
            Already have an account?{' '}
            <Link to="/login" className="text-greendark font-medium hover:text-gold transition-colors">
              Login
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}