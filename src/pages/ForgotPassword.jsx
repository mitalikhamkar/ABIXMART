import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
import { useAuth } from '@/lib/AuthContext';
import { mapAuthError } from '@/lib/authErrors';
import registerImage from '@/assets/authentication/register.png';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(mapAuthError(err));
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

        <div className="order-2 flex items-center bg-ivory py-14 lg:py-0">
          <div className="mx-auto max-w-md w-full px-6 lg:px-14">
            <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">ABIXMART Account</span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl text-greendark leading-[1.05] tracking-tight">
              Reset Your Password
            </h1>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              Enter the email on your account and we'll send you a link to reset your password.
            </p>

            {sent ? (
              <div className="mt-8 border border-greendark/15 bg-sand p-6">
                <p className="text-greendark leading-relaxed">
                  If an account exists for <span className="font-medium">{email}</span>, a password reset email is
                  on its way. Check your inbox (and spam folder).
                </p>
                <Link to="/login" className="btn-primary mt-6 inline-flex">
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mt-6 border border-red-300 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxe-sm text-greendark/50 mb-1">Email</label>
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
                <p className="mt-8 text-sm text-foreground/60">
                  Remembered it?{' '}
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