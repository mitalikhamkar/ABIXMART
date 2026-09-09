import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import AuthShell from '@/components/abix/AuthShell';
import { useAuth } from '@/lib/AuthContext';
import { mapAuthError } from '@/lib/authErrors';
import registerImage from '@/assets/authentication/register.png';

// This page is what Firebase's verification and password-reset emails now
// link to (see actionCodeSettings in AuthContext.jsx), instead of Firebase's
// own generic hosted page. It reads `mode` + `oobCode` from the URL and
// drives the SAME Firebase SDK calls that page would have made
// (applyActionCode / verifyPasswordResetCode / confirmPasswordReset) —
// we never hand-roll verification — but we control the UI, the copy, and
// what happens on failure (a stale/reused link, most commonly from
// clicking an older email after requesting a resend).

export default function AuthAction() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { confirmEmailVerification, verifyResetCode, confirmReset } = useAuth();

  const mode = params.get('mode');
  const oobCode = params.get('oobCode');

  const [status, setStatus] = useState('working'); // working | verified | reset-ready | reset-done | error
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!oobCode || !mode) {
        setStatus('error');
        setErrorMessage('This link is missing required information. Please request a new one.');
        return;
      }

      try {
        if (mode === 'verifyEmail') {
          await confirmEmailVerification(oobCode);
          if (!cancelled) setStatus('verified');
        } else if (mode === 'resetPassword') {
          const email = await verifyResetCode(oobCode);
          if (!cancelled) {
            setResetEmail(email);
            setStatus('reset-ready');
          }
        } else {
          if (!cancelled) {
            setStatus('error');
            setErrorMessage('This link type is not supported.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(mapAuthError(err));
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [mode, oobCode, confirmEmailVerification, verifyResetCode]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (passwords.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (passwords.password !== passwords.confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);
    try {
      await confirmReset(oobCode, passwords.password);
      setStatus('reset-done');
    } catch (err) {
      setErrorMessage(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell
        image={registerImage}
        imageAlt=""
        eyebrow="ABIXMART Account"
        title={
          status === 'working'
            ? 'One Moment'
            : status === 'verified'
            ? 'Email Verified'
            : status === 'reset-ready'
            ? 'Set A New Password'
            : status === 'reset-done'
            ? 'Password Updated'
            : "That Link Didn't Work"
        }
        subtitle={
          status === 'reset-ready' && resetEmail ? `For ${resetEmail}` : null
        }
        footer={
          status !== 'working' ? (
            <>
              <Link to="/login" className="text-resin font-medium hover:text-charcoal transition-colors">
                Back to Login
              </Link>
            </>
          ) : null
        }
      >
        {status === 'working' && (
          <div className="flex items-center gap-3 text-charcoal/60">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Confirming your link…</span>
          </div>
        )}

        {status === 'verified' && (
          <div>
            <div className="flex items-start gap-3 border border-resin/25 bg-resin/8 p-5">
              <CheckCircle2 size={20} className="text-resin shrink-0 mt-0.5" />
              <p className="text-charcoal leading-relaxed">
                Your email is verified. Your ABIXMART account is fully active.
              </p>
            </div>
            <button onClick={() => navigate('/account')} className="btn-primary mt-6 w-full">
              Go to My Account
            </button>
          </div>
        )}

        {status === 'reset-ready' && (
          <form onSubmit={handleResetSubmit} className="space-y-5" noValidate>
            {errorMessage && (
              <div className="border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-2.5">{errorMessage}</div>
            )}
            <div>
              <label className="block label-meta text-charcoal/50 mb-1">New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.password}
                onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))}
                placeholder="8+ characters"
                className="express-input"
              />
            </div>
            <div>
              <label className="block label-meta text-charcoal/50 mb-1">Confirm New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••"
                className="express-input"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}

        {status === 'reset-done' && (
          <div>
            <div className="flex items-start gap-3 border border-resin/25 bg-resin/8 p-5">
              <CheckCircle2 size={20} className="text-resin shrink-0 mt-0.5" />
              <p className="text-charcoal leading-relaxed">
                Your password has been updated. You can now log in with your new password.
              </p>
            </div>
            <Link to="/login" className="btn-primary mt-6 inline-flex">
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="flex items-start gap-3 border border-red-300 bg-red-50 p-5">
              <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-charcoal font-medium">{errorMessage}</p>
                <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">
                  Links expire after a while, and requesting a new email invalidates any earlier one. Log in and
                  request a fresh link from your Account page.
                </p>
              </div>
            </div>
            <Link to="/login" className="btn-primary mt-6 inline-flex">
              Back to Login
            </Link>
          </div>
        )}
      </AuthShell>
    </PageTransition>
  );
}