import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
import { useAuth } from '@/lib/AuthContext';
import { mapAuthError } from '@/lib/authErrors';
import registerImage from '@/assets/authentication/register.png';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }
  if (!EMAIL_RE.test(form.email)) errors.email = 'Please enter a valid email address.';
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export default function CreateAccount() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validate(form);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim(),
        password: form.password,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="min-h-[100svh] grid lg:grid-cols-2">
        <div className="relative h-[32vh] lg:h-auto order-1 bg-[#241b13]">
          <img src={registerImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c150f]/70 via-[#1c150f]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#1c150f]/10 lg:to-[#1c150f]/60" />
        </div>

        <div className="order-2 flex items-center bg-ivory py-14 lg:py-10">
          <div className="mx-auto max-w-md w-full px-6 lg:px-14">
            <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">ABIXMART Account</span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl text-greendark leading-[1.05] tracking-tight">
              Create Your ABIXMART Account
            </h1>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              Save your preferences, track your orders and stay connected with ABIXMART.
            </p>

            {submitted ? (
              <div className="mt-8 border border-greendark/15 bg-sand p-6">
                <p className="text-greendark leading-relaxed">
                  Your account has been created. We've sent a verification email to{' '}
                  <span className="font-medium">{form.email}</span> — please verify your address to unlock the full
                  ABIXMART experience.
                </p>
                <Link to="/login" className="btn-primary mt-6 inline-flex">
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                {formError && (
                  <div className="mt-6 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3">{formError}</div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Full Name</label>
                    <input value={form.fullName} onChange={update('fullName')} placeholder="Your name" className="express-input" />
                    {fieldErrors.fullName && <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Phone Number</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                      inputMode="numeric"
                      placeholder="10-digit mobile"
                      className="express-input"
                    />
                    {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="express-input" />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Password</label>
                    <input type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" className="express-input" />
                    {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Confirm Password</label>
                    <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••" className="express-input" />
                    {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Creating Account…' : 'Create Account'}
                  </button>
                </form>

                <p className="mt-8 text-sm text-foreground/60">
                  Already have an account?{' '}
                  <Link to="/login" className="text-greendark font-medium hover:text-gold transition-colors">
                    Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}