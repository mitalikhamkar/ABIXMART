import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import AuthShell from '@/components/abix/AuthShell';
import { useAuth } from '@/lib/AuthContext';
import { mapAuthError } from '@/lib/authErrors';
import registerImage from '@/assets/authentication/register.png';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  const sendReset = async () => {
    await resetPassword(email.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendReset();
      setSent(true);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    setError('');
    try {
      await sendReset();
      setResendDone(true);
      setTimeout(() => setResendDone(false), 4000);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell
        image={registerImage}
        imageAlt=""
        eyebrow="ABIXMART Account"
        title={sent ? 'Check Your Inbox' : 'Reset Your Password'}
        subtitle={sent ? null : "Enter the email on your account and we'll send you a link to reset your password."}
        footer={
          <>
            Remembered it?{' '}
            <Link to="/login" className="text-resin font-medium hover:text-charcoal transition-colors">
              Login
            </Link>
          </>
        }
      >
        {sent ? (
          <div>
            <div className="flex items-start gap-3 border border-charcoal/10 bg-sand/40 p-5">
              <MailCheck size={20} className="text-resin shrink-0 mt-0.5" />
              <div>
                <p className="text-charcoal leading-relaxed">
                  If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
                </p>
                <p className="mt-2 text-sm text-foreground/55 leading-relaxed">
                  Check your spam or promotions folder if it doesn't arrive within a few minutes.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={handleResend} disabled={resendLoading} className="btn-outline flex-1">
                {resendLoading ? 'Resending…' : resendDone ? 'Sent again ✓' : 'Resend Link'}
              </button>
              <Link to="/login" className="btn-primary flex-1">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-2.5">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block label-meta text-charcoal/50 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="express-input"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </AuthShell>
    </PageTransition>
  );
}