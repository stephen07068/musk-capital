import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize and validate token
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await authAPI.me();
          setUser(res.data);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials, requireAdmin = false) => {
    try {
      const res = await authAPI.login(credentials);
      const { access_token, user: userData } = res.data;
      
      const isAdmin = userData.role?.toLowerCase() === 'admin';
      
      if (requireAdmin && !isAdmin) {
        throw new Error('Access denied. This portal is for administrators only.');
      }
      if (!requireAdmin && isAdmin) {
        throw new Error('Admin accounts must use the Admin Login page (/admin/login).');
      }

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register(data);
      const { access_token, user: userData } = res.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async (googleData = {}) => {
    try {
      const res = await authAPI.google(googleData);
      const { access_token, user: userData } = res.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google sign-in failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
