import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  google: (data) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
};

// ─── Portfolio ──────────────────────────────────────────────
export const portfolioAPI = {
  get: () => api.get('/portfolio'),
  history: () => api.get(`/portfolio/history`),
};

// ─── Watchlist ──────────────────────────────────────────────
export const watchlistAPI = {
  get: () => api.get('/watchlist'),
  add: (symbol) => api.post('/watchlist', { symbol }),
  remove: (symbol) => api.delete(`/watchlist/${symbol}`),
};

// ─── Markets ────────────────────────────────────────────────
export const marketsAPI = {
  stocks: () => api.get('/markets/stocks'),
  crypto: () => api.get('/markets/crypto'),
  indices: () => api.get('/markets/indices'),
};

// ─── Deposits ───────────────────────────────────────────────
export const depositsAPI = {
  getAll: () => api.get('/deposits'),
  crypto: (data) => api.post('/deposits/crypto', data),
  giftCard: (formData) => api.post('/deposits/gift-card', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAddresses: () => api.get('/deposits/addresses'),
};

// ─── Withdrawals ────────────────────────────────────────────
export const withdrawalsAPI = {
  getAll: () => api.get('/withdrawals'),
  request: (data) => api.post('/withdrawals', data),
};

// ─── Transactions ───────────────────────────────────────────
export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
};

// ─── Notifications ──────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ─── News ───────────────────────────────────────────────────
export const newsAPI = {
  getAll: (category, featured) => api.get('/news', { params: { category, featured } }),
  bookmark: (id) => api.post(`/news/${id}/bookmark`),
  getOne: (id) => api.get(`/news/${id}`),
};

// ─── Profile ────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.patch('/profile', data),
  uploadAvatar: (formData) => api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.post('/profile/change-password', data),
};

// ─── Settings ───────────────────────────────────────────────
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.patch('/settings', data),
};

// ─── Companies ──────────────────────────────────────────────
export const companiesAPI = {
  getAll: (status, q) => api.get('/companies', { params: { status, q } }),
  getOne: (slug) => api.get(`/companies/${slug}`),
};

// ─── Search ─────────────────────────────────────────────────
export const searchAPI = {
  query: (q) => api.get('/search', { params: { q } }),
};

// ─── Admin ──────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  suspendUser: (id, action) => api.post(`/admin/users/${id}/suspend`, { action }),
  
  getDeposits: (params) => api.get('/admin/deposits', { params }),
  approveDeposit: (id) => api.post(`/admin/deposits/${id}/approve`),
  rejectDeposit: (id, reason) => api.post(`/admin/deposits/${id}/reject`, { reason }),

  getGiftCards: (params) => api.get('/admin/gift-cards', { params }),
  approveGiftCard: (id) => api.post(`/admin/gift-cards/${id}/approve`),
  rejectGiftCard: (id, reason) => api.post(`/admin/gift-cards/${id}/reject`, { reason }),

  getWithdrawals: (params) => api.get('/admin/withdrawals', { params }),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id, reason) => api.post(`/admin/withdrawals/${id}/reject`, { reason }),

  getTransactions: (params) => api.get('/admin/transactions', { params }),
  
  broadcastNotification: (data) => api.post('/admin/notifications/broadcast', data),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  getAnalytics: () => api.get('/admin/analytics'),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),

  // CRUD for Market, News, Companies
  createCompany: (data) => api.post('/admin/companies', data),
  updateCompany: (id, data) => api.put(`/admin/companies/${id}`, data),
  
  createNews: (data) => api.post('/admin/news', data),
  updateNews: (id, data) => api.put(`/admin/news/${id}`, data),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),

  createMarketAsset: (data) => api.post('/admin/markets', data),
  updateMarketAsset: (id, data) => api.put(`/admin/markets/${id}`, data),
  deleteMarketAsset: (id) => api.delete(`/admin/markets/${id}`),
};

export default api;
