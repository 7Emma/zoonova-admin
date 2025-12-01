import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useApi = () => {
  const { tokens, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Ajouter le token d'authentification si disponible
        if (tokens?.access) {
          headers.Authorization = `Bearer ${tokens.access}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        // Handle token refresh if needed
        if (response.status === 401 && tokens?.refresh) {
          // TODO: Implémenter refresh token logic
          logout();
          throw new Error('Session expirée');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Erreur ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [tokens, logout]
  );

  const get = useCallback(
    (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
    [request]
  );

  const post = useCallback(
    (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    [request]
  );

  const patch = useCallback(
    (endpoint, body, options = {}) =>
      request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    [request]
  );

  const delete_ = useCallback(
    (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
    [request]
  );

  return {
    loading,
    error,
    get,
    post,
    patch,
    delete: delete_,
  };
};
