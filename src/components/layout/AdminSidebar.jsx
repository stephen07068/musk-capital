import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, TrendingUp, Newspaper,
  ArrowDownCircle, CreditCard, ArrowUpCircle, ArrowLeftRight,
  BarChart3, PieChart, Bell, Settings, ClipboardList,
  LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'MAIN', items: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/companies', icon: Building2, label: 'Companies' },
    { to: '/admin/markets', icon: TrendingUp, label: 'Markets' },
    { to: '/admin/news', icon: Newspaper, label: 'News' },
  ]},
  { label: 'FINANCE', items: [
    { to: '/admin/deposits', icon: ArrowDownCircle, label: 'Deposits' },
    { to: '/admin/gift-cards', icon: CreditCard, label: 'Gift Cards' },
    { to: '/admin/withdrawals', icon: ArrowUpCircle, label: 'Withdrawals' },
    { to: '/admin/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  ]},
  { label: 'ANALYTICS', items: [
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/analytics', icon: PieChart, label: 'Analytics' },
  ]},
  { label: 'SYSTEM', items: [
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
  ]},
];

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2 p-4 border-b border-[#1F2937] ${collapsed ? 'justify-center' : ''}`}>
        <Link to="/" className="flex items-center shrink-0">
          {!collapsed ? (
            <span className="text-base font-black tracking-[0.08em]">
              <span className="text-white">MUSK</span>
              <span className="text-[#D4AF37] mx-1">|</span>
              <span className="text-[#D4AF37]">CAPITAL</span>
              <span className="text-[#6B7280] text-[10px] font-bold ml-1.5 uppercase tracking-widest">Admin</span>
            </span>
          ) : (
            <span className="text-sm font-black text-white tracking-tighter">MC<span className="text-[#D4AF37]">.</span></span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="ml-auto hidden lg:flex p-1 text-[#6B7280] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-4">
        {navItems.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold text-[#6B7280] tracking-widest">{section.label}</p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? label : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#1F2937]">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-400/10 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold">All systems operational</span>
            </div>
            <p className="text-[9px] text-[#6B7280]">v3.0.0 — Admin Panel</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#0D0F14] border-r border-[#1F2937] transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-56 bg-[#0D0F14] border-r border-[#1F2937] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
