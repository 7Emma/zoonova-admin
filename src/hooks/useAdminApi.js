import { useState } from 'react';
import { adminService, ApiError } from '../services';

/**
 * Hook personnalisé pour les opérations de gestion des administrateurs
 * Gère automatiquement les états loading/error
 */
export const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAllAdmins = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAllAdmins(filters);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors du chargement des administrateurs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAdminById = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getAdminById(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors du chargement de l\'administrateur';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getMe();
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors du chargement du profil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.createAdmin(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (id, data) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.updateAdmin(id, data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const partialUpdateAdmin = async (id, data) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.partialUpdateAdmin(id, data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminActive = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.toggleAdminActive(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la modification du statut';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.deleteAdmin(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Erreur lors de la suppression';
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
    getAllAdmins,
    getAdminById,
    getMe,
    createAdmin,
    updateAdmin,
    partialUpdateAdmin,
    toggleAdminActive,
    deleteAdmin,
  };
};

export default useAdminApi;
