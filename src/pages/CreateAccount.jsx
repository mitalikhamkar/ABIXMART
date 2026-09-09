import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import AuthShell from '@/components/abix/AuthShell';
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

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verifyIssue, setVerifyIssue] = useState(null);

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
      const { verificationError } = await register({
        fullName: form.fullName.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim(),
        password: form.password,
      });
      setSubmitted(true);
      setVerifyIssue(verificationError ? mapAuthError(verificationError) : null);
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Compact field: label + input share one row's rhythm rather than
  // each stacking with its own generous margin — this, plus tighter
  // vertical gaps, is what keeps the 5-field desktop form from forcing
  // scroll inside the panel.
  const Field = ({ label, error, children, extra }) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="label-meta text-charcoal/50">{label}</label>
        {extra}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );

  return (
    <PageTransition>
      <AuthShell
        image={registerImage}
        imageAlt=""
        eyebrow="ABIXMART Account"
        title={submitted ? 'Account Created' : 'Create Your Account'}
        subtitle={submitted ? null : 'A more considered way to shop wellness — starting with your own space.'}
        footer={
          submitted ? null : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-resin font-medium hover:text-charcoal transition-colors">
                Login
              </Link>
            </>
          )
        }
      >
        {submitted ? (
          <div>
            {verifyIssue ? (
              <div className="border border-resin/30 bg-resin/8 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-resin shrink-0 mt-0.5" />
                  <div>
                    <p className="text-charcoal font-medium">Your account was created.</p>
                    <p className="mt-1.5 text-sm text-foreground/65 leading-relaxed">
                      We couldn't send the verification email right now: {verifyIssue} You can resend it anytime
                      from your Account page.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-charcoal leading-relaxed">
                A verification email is on its way to <span className="font-medium">{form.email}</span>. Check your
                inbox — and your spam or promotions folder — then verify to unlock the full ABIXMART experience.
              </p>
            )}
            <Link to="/login" className="btn-primary mt-6 inline-flex">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {formError && (
              <div className="mb-4 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-2.5">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field label="Full Name" error={fieldErrors.fullName}>
                <input value={form.fullName} onChange={update('fullName')} placeholder="Your name" className="express-input" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number" error={fieldErrors.phone}>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                    inputMode="numeric"
                    placeholder="10-digit mobile"
                    className="express-input"
                  />
                </Field>
                <Field label="Email" error={fieldErrors.email}>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="express-input" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Password" error={fieldErrors.password}>
                  <input type="password" value={form.password} onChange={update('password')} placeholder="8+ characters" className="express-input" />
                </Field>
                <Field label="Confirm" error={fieldErrors.confirmPassword}>
                  <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••" className="express-input" />
                </Field>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </AuthShell>
    </PageTransition>
  );
}