import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Heart, ShoppingBag, User, LogOut } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';
import { useAuth } from '@/lib/AuthContext';
import logo from '@/assets/logo/Abixmart-header.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Support', to: '/support' },
];

export default function Header() {
  const { cartCount, wishlistCount, openCart, openSearch } = useShop();
  const { user, profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setAccountMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    await logout();
    navigate('/');
  };

  const initial = (profile?.fullName || user?.email || '?').charAt(0).toUpperCase();

  const onHome = location.pathname === '/';
  const transparent = onHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          transparent ? 'bg-transparent' : 'bg-espresso/90 backdrop-blur-md border-b border-ivory/10'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="ABIXMART home">
            {/*
              NOTE on contrast: the source artwork's wordmark is dark
              green with no light/ivory variant baked in, so against
              this dark header it reads as visible-but-dim rather than
              crisp white-on-dark like the old text logo did. The gold
              ribbon and leaf highlights still pop. If you want a
              brighter version for this dark placement, ask for an
              ivory-recolored variant of the same artwork — it's a
              straightforward follow-up, not done here since it wasn't
              requested.
            */}
            <img
              src={logo}
              alt="ABIXMART"
              className="h-11 lg:h-[52px] w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    transparent ? 'text-ivory/80 hover:text-ivory' : 'text-ivory/70 hover:text-ivory'
                  } ${active ? 'text-ivory' : ''}`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-gold-light"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={openSearch}
              className="h-10 w-10 inline-flex items-center justify-center transition-colors text-ivory/80 hover:text-ivory"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
            <Link
              to="/shop"
              className="relative h-10 w-10 inline-flex items-center justify-center transition-colors text-ivory/80 hover:text-ivory"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-gold-light text-charcoal text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative h-10 w-10 inline-flex items-center justify-center transition-colors text-ivory/80 hover:text-ivory"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-resin text-ivory text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  className="ml-2 h-9 w-9 rounded-full bg-ivory text-charcoal font-display text-sm flex items-center justify-center hover:bg-resin hover:text-ivory transition-colors duration-300"
                >
                  {initial}
                </button>
                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-48 bg-ivory border border-charcoal/10 shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-sand transition-colors"
                      >
                        <User size={14} />
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-sand transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 h-10 ml-2 px-5 bg-resin text-ivory text-[12px] font-medium tracking-luxe-sm uppercase rounded-none hover:bg-gold-light hover:text-charcoal transition-colors duration-300"
              >
                <User size={14} />
                Login
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-10 w-10 inline-flex items-center justify-center text-ivory"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-espresso md:hidden pt-16"
          >
            <div className="px-6 py-6 flex flex-col">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={l.to}
                    className={`block py-4 font-display text-3xl border-b border-ivory/10 ${
                      location.pathname === l.to ? 'text-gold-light' : 'text-ivory/70'
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="mt-6 h-14 inline-flex items-center justify-center gap-2 bg-resin text-ivory text-sm tracking-luxe-sm uppercase"
                  >
                    <User size={16} /> My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-3 h-14 inline-flex items-center justify-center gap-2 border border-ivory/20 text-ivory text-sm tracking-luxe-sm uppercase"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="mt-6 h-14 inline-flex items-center justify-center bg-resin text-ivory text-sm tracking-luxe-sm uppercase"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}