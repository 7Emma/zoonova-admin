import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, apiClient } from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('public'); // 'public', 'client', 'staff'
  const [tokens, setTokens] = useState({ access: null, refresh: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifie l'authentification au chargement
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = authService.getLocalUser();
        const storedTokens = authService.getTokens();

        if (storedUser && storedTokens.access) {
          setUser(storedUser);
          setTokens(storedTokens);
          setIsAuthenticated(true);
          setUserRole(storedUser.is_staff ? 'staff' : 'client');
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Écoute les événements d'authentification non autorisée (401)
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setUserRole('public');
      setTokens({ access: null, refresh: null });
      setError('Votre session a expiré. Veuillez vous reconnecter.');
      navigate('/login', { replace: true });
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setIsAuthenticated(true);
    setUserRole(userData.is_staff ? 'staff' : 'client');
    setTokens({ access: accessToken, refresh: refreshToken });
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole('public');
    setTokens({ access: null, refresh: null });
    authService.logout();
    setError(null);
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
  };

  const updateUser = (userData) => {
    setUser(userData);
    apiClient.setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        tokens,
        loading,
        error,
        setLoading,
        setError,
        login,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
