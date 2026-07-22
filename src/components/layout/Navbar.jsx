import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/companies', label: 'Companies' },
  { to: '/markets', label: 'Markets' },
  { to: '/news', label: 'News' },
  { to: '/dashboard/portfolio', label: 'Portfolio' },
  { to: '/dashboard/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-[36px] left-0 right-0 z-50 glass border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <span className="text-xl font-black tracking-[0.1em]">
              <span className="text-white">MUSK</span>
              <span className="text-[#D4AF37] mx-1.5">|</span>
              <span className="text-[#D4AF37]">CAPITAL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-[#9CA3AF] hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-colors">
                  <User size={14} />
                  {user.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="hidden sm:block px-3 py-1.5 text-sm text-[#9CA3AF] hover:text-white transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-white border border-[#374151] rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-black gold-gradient rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/8 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search companies, markets, news..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] bg-[#1F2937] px-1.5 py-0.5 rounded">⌘ K</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/8 bg-[#07090D]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-white/8 flex gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1 py-2 text-center text-sm font-medium text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg">Dashboard</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex-1 py-2 text-center text-sm text-[#9CA3AF]">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2 text-center text-sm font-medium text-white border border-[#1F2937] rounded-lg">Log In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-2 text-center text-sm font-semibold text-black gold-gradient rounded-lg">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
