import { useState } from 'react';
import { authService, ApiError } from '../services';

/**
 * Hook personnalisé pour les opérations d'authentification
 * Gère automatiquement les états loading/error
 */
export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur d\'authentification';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
  };

  const setPassword = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.setPassword(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la définition du mot de passe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la demande';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.confirmPasswordReset(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la réinitialisation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.changePassword(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors du chargement du profil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    login,
    logout,
    setPassword,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
    getCurrentUser,
  };
};

export default useAuthApi;
