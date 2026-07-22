import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Building2, TrendingUp, Bookmark,
  Newspaper, ArrowDownCircle, ArrowUpCircle, List, Bell,
  User, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, Rocket, Headphones
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/dashboard/plans', icon: Rocket, label: 'Investment Plans' },
  { to: '/dashboard/companies', icon: Building2, label: 'Companies' },
  { to: '/dashboard/markets', icon: TrendingUp, label: 'Markets' },
  { to: '/dashboard/watchlist', icon: Bookmark, label: 'Watchlist' },
  { to: '/dashboard/news', icon: Newspaper, label: 'News' },
];

const actionItems = [
  { to: '/dashboard/deposit', icon: ArrowDownCircle, label: 'Deposit', color: '#10B981' },
  { to: '/dashboard/withdraw', icon: ArrowUpCircle, label: 'Withdraw', color: '#EF4444' },
  { to: '/dashboard/transactions', icon: List, label: 'Transactions' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications', badge: true },
];

const accountItems = [
  { to: '/support', icon: Headphones, label: 'Customer Support', color: '#D4AF37' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function NavItem({ to, icon: Icon, label, end, color, badge, notifCount, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
          isActive
            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
            : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
      title={collapsed ? label : undefined}
    >
      <Icon size={18} style={color ? { color } : undefined} className="shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge && notifCount > 0 && (
        <span className="text-[10px] font-bold text-black bg-[#D4AF37] w-5 h-5 rounded-full flex items-center justify-center">
          {notifCount}
        </span>
      )}
      {collapsed && badge && notifCount > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + Collapse Toggle */}
      <div className={`flex items-center border-b border-[#1F2937] ${collapsed ? 'p-3 justify-center' : 'p-4 justify-between'}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center min-w-0">
            <span className="text-lg font-black tracking-[0.08em]">
              <span className="text-white">MUSK</span>
              <span className="text-[#D4AF37] mx-1">|</span>
              <span className="text-[#D4AF37]">CAPITAL</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="text-sm font-black text-white tracking-tighter">MC<span className="text-[#D4AF37]">.</span></Link>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1 text-[#9CA3AF] hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {!collapsed && <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest px-3 py-2">Main</p>}
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        {!collapsed && <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest px-3 py-2 mt-3">Finance</p>}
        {collapsed && <div className="my-2 border-t border-[#1F2937]" />}
        {actionItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} notifCount={3} />
        ))}

        {!collapsed && <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest px-3 py-2 mt-3">Account</p>}
        {collapsed && <div className="my-2 border-t border-[#1F2937]" />}
        {accountItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className="p-3 border-t border-[#1F2937]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#D4AF37] truncate">👑 Premium</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#050505] border-r border-[#1F222A] transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-64 h-full bg-[#050505] border-r border-[#1F222A] flex flex-col z-10">
            <button onClick={onMobileClose} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white">
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
