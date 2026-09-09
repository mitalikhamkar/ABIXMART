import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, ShieldCheck, RefreshCw, Package, MapPin, Heart, Users,
  Facebook, MessageCircle, Instagram, Send,
} from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import { useAuth } from '@/lib/AuthContext';

const RESEND_COOLDOWN_S = 30;

const SPACE_SECTIONS = [
  {
    key: 'orders',
    label: 'Orders',
    icon: Package,
    heading: 'Your Ritual Orders',
    body: 'Your purchases will appear here once you place your first ABIXMART order.',
    cta: { label: 'Explore Products', to: '/shop' },
  },
  {
    key: 'addresses',
    label: 'Addresses',
    icon: MapPin,
    heading: 'Delivery Addresses',
    body: 'Save your preferred delivery address for a faster checkout.',
    cta: null,
  },
  {
    key: 'wishlist',
    label: 'Wishlist',
    icon: Heart,
    heading: 'Your Wishlist',
    body: 'Products you save for your next ritual will appear here.',
    cta: { label: 'Browse Shop', to: '/shop' },
  },
  {
    key: 'community',
    label: 'Community',
    icon: Users,
    heading: 'The ABIXMART Circle',
    body: 'Stay connected with the community around better everyday rituals.',
    cta: null,
    social: [
      { icon: Facebook, label: 'Facebook' },
      { icon: MessageCircle, label: 'WhatsApp' },
      { icon: Instagram, label: 'Instagram' },
      { icon: Send, label: 'Telegram' },
    ],
  },
];

function formatMemberSince(createdAt) {
  // Firestore Timestamp has .toDate(); guard for plain values too.
  const date = createdAt?.toDate ? createdAt.toDate() : createdAt ? new Date(createdAt) : null;
  if (!date || Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function Account() {
  const { user, profile, loading, logout, resendVerification, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('profile');
  const [resendState, setResendState] = useState('idle'); // idle | sending | sent | error
  const [resendError, setResendError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (loading || !user) {
    return (
      <PageTransition>
        <section className="min-h-[100svh] flex items-center justify-center bg-ivory">
          <p className="text-charcoal/50 text-sm uppercase tracking-luxe-sm">Loading…</p>
        </section>
      </PageTransition>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleResend = async () => {
    if (resendState === 'sending' || cooldown > 0) return;
    setResendState('sending');
    setResendError('');
    try {
      await resendVerification();
      setResendState('sent');
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setResendState('error');
      setResendError(err?.message || 'Could not send the verification email. Please try again shortly.');
    }
  };

  const handleCheckAgain = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await refreshUser();
    } finally {
      setChecking(false);
    }
  };

  // Full stored name — never truncated to a nickname/first-token.
  const fullName = profile?.fullName || 'Your Account';
  const initial = fullName.charAt(0).toUpperCase();

  const navItems = [
    { key: 'profile', label: 'Profile' },
    ...SPACE_SECTIONS.map((s) => ({ key: s.key, label: s.label })),
  ];

  return (
    <PageTransition>
      <section className="min-h-[100svh] bg-sand/30 relative">
        <div className="absolute inset-0 grain pointer-events-none opacity-[0.02]" />

        {/* Header */}
        <div className="relative bg-espresso text-ivory">
          <div className="mx-auto max-w-6xl px-6 lg:px-10 py-16 lg:py-20">
            <span className="label-meta text-gold-light">ABIXMART Account</span>
            <div className="mt-5 flex items-center gap-5">
              <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-resin text-ivory font-display text-2xl lg:text-3xl flex items-center justify-center shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-ivory/55 text-sm">Welcome back,</p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight break-words">
                  {fullName}
                </h1>
              </div>
            </div>
            <p className="mt-5 text-ivory/60 text-sm max-w-lg leading-relaxed">
              Your ABIXMART space — manage your profile, orders and everyday ritual.
            </p>
          </div>
        </div>

        {/* Body: left nav + right content */}
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
            {/* Left nav */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`text-left whitespace-nowrap px-4 py-3 label-meta transition-colors border-l-2 lg:border-l-2 ${
                    activeSection === item.key
                      ? 'border-resin text-charcoal bg-ivory'
                      : 'border-transparent text-charcoal/45 hover:text-charcoal hover:bg-ivory/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="lg:mt-6 flex items-center gap-2 whitespace-nowrap px-4 py-3 label-meta text-charcoal/45 hover:text-charcoal transition-colors border-l-2 border-transparent"
              >
                <LogOut size={13} />
                Logout
              </button>
            </nav>

            {/* Right content */}
            <div>
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-2xl text-charcoal">Profile</h2>
                    <div className="mt-6 divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
                      {[
                        ['Full Name', fullName],
                        ['Email', user.email],
                        ['Phone', profile?.phone || '—'],
                        ['Member Since', formatMemberSince(profile?.createdAt)],
                        ['Email Status', user.emailVerified ? 'Verified' : 'Not verified'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between py-4">
                          <dt className="label-meta text-charcoal/45">{label}</dt>
                          <dd className="text-charcoal text-sm sm:text-base text-right">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification panel */}
                  <div className="border border-charcoal/10">
                    {user.emailVerified ? (
                      <div className="bg-resin/6 p-6 sm:p-7 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-resin/15 flex items-center justify-center shrink-0">
                          <ShieldCheck size={20} className="text-resin" />
                        </div>
                        <div>
                          <p className="text-charcoal font-medium">Email Verified</p>
                          <p className="text-sm text-foreground/55 mt-0.5">Your ABIXMART account is active and ready.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-ivory p-6 sm:p-7">
                        <span className="label-meta text-resin">Email Verification</span>
                        <p className="mt-2 text-charcoal leading-relaxed">
                          We've sent a verification link to <span className="font-medium">{user.email}</span>.
                        </p>
                        <p className="mt-1 text-sm text-foreground/55">
                          Check your inbox, Spam, or Promotions folder.
                        </p>

                        {resendState === 'error' && (
                          <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                            {resendError}
                          </p>
                        )}
                        {resendState === 'sent' && cooldown > 0 && (
                          <p className="mt-3 text-sm text-resin">Verification email sent.</p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <button
                            onClick={handleResend}
                            disabled={resendState === 'sending' || cooldown > 0}
                            className="btn-outline"
                          >
                            {resendState === 'sending'
                              ? 'Sending…'
                              : cooldown > 0
                              ? `Resend in ${cooldown}s`
                              : 'Resend Verification'}
                          </button>
                          <button
                            onClick={handleCheckAgain}
                            disabled={checking}
                            className="inline-flex items-center gap-1.5 label-meta text-charcoal/50 hover:text-charcoal transition-colors disabled:opacity-40"
                          >
                            <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
                            {checking ? 'Checking…' : 'Check Verification'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {SPACE_SECTIONS.filter((s) => s.key === activeSection).map((section) => (
                <div key={section.key} className="max-w-xl">
                  <section.icon size={22} className="text-resin" />
                  <h2 className="mt-4 font-display text-2xl text-charcoal">{section.heading}</h2>
                  <p className="mt-2 text-foreground/60 leading-relaxed">{section.body}</p>

                  {section.cta && (
                    <button onClick={() => navigate(section.cta.to)} className="btn-primary mt-6">
                      {section.cta.label}
                    </button>
                  )}

                  {section.social && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {section.social.map(({ icon: Icon, label }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-2 border border-charcoal/15 px-4 py-2.5 text-sm text-charcoal/60"
                        >
                          <Icon size={15} />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}