import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import TickerBar from './components/layout/TickerBar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import ActivityToast from './components/ui/ActivityToast';

// Public pages
import Home from './pages/public/Home';
import Companies from './pages/public/Companies';
import CompanyDetail from './pages/public/CompanyDetail';
import Markets from './pages/public/Markets';
import News from './pages/public/News';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Support from './pages/public/Support';
import NotFound from './pages/public/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// User dashboard pages
import UserDashboard from './pages/user/Dashboard';
import Portfolio from './pages/user/Portfolio';
import InvestmentPlans from './pages/user/InvestmentPlans';
import UserCompanies from './pages/user/UserCompanies';
import UserMarkets from './pages/user/UserMarkets';
import Watchlist from './pages/user/Watchlist';
import UserNews from './pages/user/UserNews';
import Deposit from './pages/user/Deposit';
import Withdraw from './pages/user/Withdraw';
import Transactions from './pages/user/Transactions';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';
import Settings from './pages/user/UserSettings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CompanyManagement from './pages/admin/CompanyManagement';
import MarketManagement from './pages/admin/MarketManagement';
import NewsManagement from './pages/admin/NewsManagement';
import DepositManagement from './pages/admin/DepositManagement';
import GiftCardManagement from './pages/admin/GiftCardManagement';
import WithdrawalManagement from './pages/admin/WithdrawalManagement';
import AdminTransactions from './pages/admin/AdminTransactions';
import Reports from './pages/admin/Reports';
import Analytics from './pages/admin/Analytics';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';
import AuditLogs from './pages/admin/AuditLogs';

/* ── Layout with Ticker + Navbar + Footer ── */
function PublicLayout() {
  return (
    <>
      <TickerBar isFixed={true} />
      <Navbar />
      <main className="pt-[100px]">
        <Outlet />
      </main>
      <Footer />
      <ActivityToast />
    </>
  );
}

/* ── Protected Route ── */
function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/* ── Guest Route (redirect if already logged in) ── */
function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<About />} />
            <Route path="/terms" element={<About />} />
          </Route>

          {/* Auth routes (guest only) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* User dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/portfolio" element={<Portfolio />} />
              <Route path="/dashboard/plans" element={<InvestmentPlans />} />
              <Route path="/dashboard/companies" element={<UserCompanies />} />
              <Route path="/dashboard/markets" element={<UserMarkets />} />
              <Route path="/dashboard/watchlist" element={<Watchlist />} />
              <Route path="/dashboard/news" element={<UserNews />} />
              <Route path="/dashboard/deposit" element={<Deposit />} />
              <Route path="/dashboard/withdraw" element={<Withdraw />} />
              <Route path="/dashboard/transactions" element={<Transactions />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/companies" element={<CompanyManagement />} />
              <Route path="/admin/markets" element={<MarketManagement />} />
              <Route path="/admin/news" element={<NewsManagement />} />
              <Route path="/admin/deposits" element={<DepositManagement />} />
              <Route path="/admin/gift-cards" element={<GiftCardManagement />} />
              <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
