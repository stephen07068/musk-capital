import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TickerBar from './TickerBar';
import { useAuth } from '../../context/AuthContext';
import { notificationsData } from '../../data/mockData';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = notificationsData.filter((n) => !n.read).length;
  const displayUser = user || { name: 'John Doe', email: 'john@example.com' };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-[#050505] border-b border-[#1F222A] shrink-0">
          <TickerBar />
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search markets, companies, news..."
                className="w-full pl-9 pr-4 py-2 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-white placeholder-[#6B7280] text-xs focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative p-2 text-[#9CA3AF] hover:text-white transition-colors rounded-xl hover:bg-white/5"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] rounded-full text-black text-[9px] font-black flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 bg-[#0D0F14] border border-[#1F222A] rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-[#1F222A]">
                        <p className="text-sm font-bold text-white">Notifications</p>
                        <span className="text-xs text-[#D4AF37] font-semibold">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notificationsData.slice(0, 5).map((n) => (
                          <div key={n.id} className={`p-4 border-b border-[#1F222A]/50 hover:bg-white/5 transition-colors ${!n.read ? 'bg-[#D4AF37]/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#D4AF37]' : 'bg-[#374151]'}`} />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white">{n.title}</p>
                                <p className="text-[11px] text-[#9CA3AF] mt-0.5 line-clamp-2">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-center justify-center p-3 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                      >
                        View All Notifications →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User avatar and Logout */}
              <div className="flex items-center gap-4 pl-2 border-l border-[#1F222A]">
                <Link to="/dashboard/profile" className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm shrink-0">
                    {displayUser.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white">{displayUser.name || 'User'}</p>
                    <p className="text-[10px] text-[#D4AF37]">👑 Premium</p>
                  </div>
                </Link>

                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="flex items-center justify-center p-2 rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
