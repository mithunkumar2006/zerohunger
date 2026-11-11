import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  async function fetchProfile() {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to sync authentication profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(role, email, password) {
    try {
      const data = await authService.login(role, email, password);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login request failed:', error.response?.data || error.message);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, error: errMsg };
    }
  }

  async function register(role, userData) {
    try {
      const data = await authService.register(role, userData);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration request failed:', error.response?.data || error.message);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Registration failed.';
      return { success: false, error: errMsg };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, refetchProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}