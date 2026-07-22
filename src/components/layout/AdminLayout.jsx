import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#07090D]">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="bg-[#0D0F14] border-b border-[#1F2937] px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              placeholder="Search users, transactions, deposits..."
              className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl text-white placeholder-[#6B7280] text-xs focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B7280] bg-[#1F2937] px-1.5 py-0.5 rounded hidden sm:block">⌘ K</kbd>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 text-[#9CA3AF] hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-black text-black flex items-center justify-center">8</span>
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-72 bg-[#0D0F14] border border-[#1F2937] rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-[#1F2937]">
                      <p className="text-sm font-bold text-white">Admin Alerts</p>
                    </div>
                    {[
                      { icon: '💰', msg: '3 deposits pending approval', time: '5m ago' },
                      { icon: '💳', msg: '2 gift cards awaiting review', time: '12m ago' },
                      { icon: '📤', msg: '3 withdrawals need approval', time: '1h ago' },
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors flex items-start gap-3">
                        <span className="text-base">{n.icon}</span>
                        <div>
                          <p className="text-xs text-white">{n.msg}</p>
                          <p className="text-[10px] text-[#6B7280] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <Link to="/admin/notifications" onClick={() => setNotifOpen(false)} className="flex items-center justify-center p-3 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                      View All Alerts →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar and Logout */}
            <div className="flex items-center gap-4 pl-4 border-l border-[#1F2937]">
              <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-[#D4AF37]">Super Admin</p>
                </div>
              </div>
              
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
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
