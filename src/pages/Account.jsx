import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut, ShieldCheck, RefreshCw, Package, MapPin, Heart, Users,
  Facebook, MessageCircle, Instagram, Send,
} from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import { useAuth } from '@/lib/AuthContext';
import mineralBg from '@/assets/shilajit-steps/himalayaBG.png';
import logo from '@/assets/logo/abixmart-header.png';

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

function formatMemberSince(createdAt, fallbackAuthCreationTime) {
  let date = createdAt?.toDate ? createdAt.toDate() : createdAt ? new Date(createdAt) : null;
  if ((!date || Number.isNaN(date.getTime())) && fallbackAuthCreationTime) {
    date = new Date(fallbackAuthCreationTime);
  }
  if (!date || Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function Account() {
  const { user, profile, loading, logout, resendVerification, refreshUser } = useAuth();
  const navigate = useNavigate();

  const isGoogleUser =
    profile?.provider === 'google' || user?.providerData?.some((p) => p.providerId === 'google.com');

  const [activeSection, setActiveSection] = useState('profile');
  const [resendState, setResendState] = useState('idle');
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
        <section className="min-h-[100svh] flex items-center justify-center bg-charcoal">
          <p className="text-ivory/40 text-sm uppercase tracking-luxe-sm">Loading…</p>
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

  const fullName = profile?.fullName || user?.displayName || 'Your Account';
  const initial = fullName.charAt(0).toUpperCase();
  const photoURL = profile?.photoURL || user?.photoURL || '';
  const verified = isGoogleUser || user.emailVerified;
  const memberSince = formatMemberSince(profile?.createdAt, user?.metadata?.creationTime);

  const navItems = [
    { key: 'profile', label: 'Profile' },
    ...SPACE_SECTIONS.map((s) => ({ key: s.key, label: s.label })),
  ];

  return (
    <PageTransition>
      <section className="relative min-h-[100svh] bg-charcoal text-ivory">
        {/* Immersive mineral environment spanning the full page, not just a header band */}
        <img
          src={mineralBg}
          alt=""
          className="fixed inset-0 h-full w-full object-cover opacity-25 scale-110 pointer-events-none"
        />
        <div className="fixed inset-0 bg-gradient-to-b from-charcoal/95 via-charcoal/90 to-charcoal/95 pointer-events-none" />
        <div className="fixed inset-0 grain opacity-[0.05] pointer-events-none" />

        <div className="relative z-10">
          {/* Hero / identity */}
          <div className="mx-auto max-w-6xl px-6 lg:px-10 pt-12 lg:pt-16 pb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-ivory/90 backdrop-blur px-3 py-1.5 shadow-md">
                <img src={logo} alt="ABIXMART" className="h-5 w-auto object-contain" />
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-luxe-sm text-ivory/50 hover:text-ivory transition-colors border border-ivory/15 hover:border-ivory/30 rounded-full px-3.5 py-2 shrink-0"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>

            <span className="mt-8 block label-meta text-gold-light">Your ABIXMART</span>

            <div className="mt-4 flex items-center gap-5">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover shrink-0 border border-ivory/20"
                />
              ) : (
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-resin text-ivory font-display text-2xl lg:text-3xl flex items-center justify-center shrink-0">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-ivory/55 text-sm">Welcome back,</p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight break-words">
                  {fullName}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ivory/50">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${verified ? 'bg-resin-light' : 'bg-ivory/30'}`} />
                    {verified ? 'Verified' : 'Not verified'}
                  </span>
                  <span className="text-ivory/20">•</span>
                  <span>Member since {memberSince}</span>
                  <span className="text-ivory/20 hidden sm:inline">•</span>
                  <span className="w-full sm:w-auto truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation — logout intentionally lives near identity above, not here */}
          <div className="sticky top-0 z-20 backdrop-blur-xl bg-charcoal/70 border-y border-ivory/10">
            <div className="mx-auto max-w-6xl px-6 lg:px-10">
              <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`relative whitespace-nowrap px-4 sm:px-5 py-4 label-meta transition-colors ${
                      activeSection === item.key ? 'text-ivory' : 'text-ivory/40 hover:text-ivory/80'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.key && (
                      <motion.span
                        layoutId="account-nav-underline"
                        className="absolute left-4 right-4 sm:left-5 sm:right-5 -bottom-px h-px bg-gold-light"
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 lg:py-16">
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl text-ivory">Profile</h2>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      ['Full Name', fullName],
                      ['Email', user.email],
                      ['Phone', profile?.phone || '—'],
                      ['Member Since', memberSince],
                      ['Email Status', verified ? 'Verified' : 'Not verified'],
                      ['Sign-in Method', isGoogleUser ? 'Google' : 'Email & Password'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="border border-ivory/10 bg-ivory/5 backdrop-blur-sm rounded-lg px-5 py-4"
                      >
                        <dt className="label-meta text-ivory/40">{label}</dt>
                        <dd className="mt-1.5 text-ivory text-base sm:text-lg font-display truncate">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification — only surfaces when action is actually needed;
                    verified users already see the small badge in the hero above. */}
                {!verified && (
                  <div className="border border-ivory/10 bg-ivory/5 backdrop-blur-sm rounded-lg p-6 sm:p-7">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-gold-light" />
                      <span className="label-meta text-gold-light">Email Verification</span>
                    </div>
                    <p className="mt-2.5 text-ivory leading-relaxed">
                      We've sent a verification link to <span className="font-medium">{user.email}</span>.
                    </p>
                    <p className="mt-1 text-sm text-ivory/50">Check your inbox, Spam, or Promotions folder.</p>

                    {resendState === 'error' && (
                      <p className="mt-3 text-sm text-red-200 bg-red-950/30 border border-red-400/40 px-3 py-2">
                        {resendError}
                      </p>
                    )}
                    {resendState === 'sent' && cooldown > 0 && (
                      <p className="mt-3 text-sm text-gold-light">Verification email sent.</p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleResend}
                        disabled={resendState === 'sending' || cooldown > 0}
                        className="inline-flex items-center justify-center h-11 px-5 border border-ivory/20 text-ivory/90 text-sm hover:bg-ivory/10 transition-colors disabled:opacity-50"
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
                        className="inline-flex items-center gap-1.5 label-meta text-ivory/50 hover:text-ivory transition-colors disabled:opacity-40"
                      >
                        <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
                        {checking ? 'Checking…' : 'Check Verification'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {SPACE_SECTIONS.filter((s) => s.key === activeSection).map((section) => (
              <div key={section.key} className="max-w-xl">
                <section.icon size={22} className="text-gold-light" />
                <h2 className="mt-4 font-display text-2xl text-ivory">{section.heading}</h2>
                <p className="mt-2 text-ivory/55 leading-relaxed">{section.body}</p>

                {section.cta && (
                  <button onClick={() => navigate(section.cta.to)} className="btn-primary-inverse mt-6">
                    {section.cta.label}
                  </button>
                )}

                {section.social && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {section.social.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 border border-ivory/15 px-4 py-2.5 text-sm text-ivory/60"
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
      </section>
    </PageTransition>
  );
}