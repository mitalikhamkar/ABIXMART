import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import { useAuth } from '@/lib/AuthContext';

export default function Account() {
  const { user, profile, loading, logout, resendVerification, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <PageTransition>
        <section className="min-h-[100svh] flex items-center justify-center bg-ivory">
          <p className="text-greendark/50 text-sm uppercase tracking-luxe-sm">Loading…</p>
        </section>
      </PageTransition>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <PageTransition>
      <section className="min-h-[100svh] bg-ivory py-28 lg:py-36">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-greendark text-ivory font-display text-2xl flex items-center justify-center">
              {(profile?.fullName || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">My Account</span>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl text-greendark leading-tight tracking-tight">
                {profile?.fullName || 'Your Account'}
              </h1>
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-px bg-greendark/10 border border-greendark/10">
            <div className="bg-ivory p-6">
              <dt className="text-[10px] uppercase tracking-luxe-sm text-greendark/45">Email</dt>
              <dd className="mt-1 text-greendark">{user.email}</dd>
            </div>
            <div className="bg-ivory p-6">
              <dt className="text-[10px] uppercase tracking-luxe-sm text-greendark/45">Phone</dt>
              <dd className="mt-1 text-greendark">{profile?.phone || '—'}</dd>
            </div>
            <div className="bg-ivory p-6 sm:col-span-2">
              <dt className="text-[10px] uppercase tracking-luxe-sm text-greendark/45">Email Verification</dt>
              <dd className="mt-2 flex items-center gap-2 flex-wrap">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-greendark">
                    <ShieldCheck size={16} className="text-gold" /> Verified
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-greendark/70">
                      <ShieldAlert size={16} /> Not verified yet
                    </span>
                    <button
                      onClick={resendVerification}
                      className="text-[11px] uppercase tracking-luxe-sm text-gold hover:text-greendark transition-colors ml-2"
                    >
                      Resend Email
                    </button>
                    <button
                      onClick={refreshUser}
                      className="inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe-sm text-greendark/40 hover:text-greendark transition-colors ml-2"
                    >
                      <RefreshCw size={12} /> I've Verified
                    </button>
                  </>
                )}
              </dd>
            </div>
          </div>

          {/* Placeholder sections — reserved for future milestones */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Orders', 'Addresses', 'Wishlist', 'Community'].map((label) => (
              <div key={label} className="border border-greendark/10 p-6 text-center text-greendark/40">
                <span className="text-[11px] uppercase tracking-luxe-sm">{label}</span>
                <p className="mt-1 text-xs">Coming soon</p>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} className="btn-outline mt-12 inline-flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </section>
    </PageTransition>
  );
}