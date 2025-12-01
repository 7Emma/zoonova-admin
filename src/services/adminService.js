/**
 * Service de gestion des administrateurs
 * Gère la création, modification et suppression des administrateurs
 */

import apiClient from './api';

const AUTH_ENDPOINT = '/auth';
const ADMINS_ENDPOINT = `${AUTH_ENDPOINT}/admins`;

export const adminService = {
  /**
   * Récupère la liste de tous les administrateurs
   * @param {Object} filters - Filtres optionnels
   * @param {boolean} filters.is_active - Filtrer par statut actif
   * @param {boolean} filters.is_superuser - Filtrer par statut superuser
   */
  async getAllAdmins(filters = {}) {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined) {
      params.append('is_active', filters.is_active);
    }
    if (filters.is_superuser !== undefined) {
      params.append('is_superuser', filters.is_superuser);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`${ADMINS_ENDPOINT}/${query}`);
  },

  /**
   * Récupère les détails d'un administrateur spécifique
   * @param {number} id - ID de l'administrateur
   */
  async getAdminById(id) {
    return apiClient.get(`${ADMINS_ENDPOINT}/${id}/`);
  },

  /**
   * Récupère les informations de l'administrateur connecté
   */
  async getMe() {
    return apiClient.get(`${ADMINS_ENDPOINT}/me/`);
  },

  /**
   * Crée un nouvel administrateur
   * @param {Object} data - Données du nouvel administrateur
   * @param {string} data.email - Email de l'administrateur
   * @param {string} data.first_name - Prénom
   * @param {string} data.last_name - Nom de famille
   * @param {boolean} data.is_staff - Statut staff
   * @param {boolean} data.is_superuser - Statut superuser
   */
  async createAdmin(data) {
    return apiClient.post(`${ADMINS_ENDPOINT}/`, data);
  },

  /**
   * Met à jour complètement un administrateur (PUT)
   * @param {number} id - ID de l'administrateur
   * @param {Object} data - Données à mettre à jour
   */
  async updateAdmin(id, data) {
    return apiClient.put(`${ADMINS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Met à jour partiellement un administrateur (PATCH)
   * @param {number} id - ID de l'administrateur
   * @param {Object} data - Données à mettre à jour
   */
  async partialUpdateAdmin(id, data) {
    return apiClient.patch(`${ADMINS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Active ou désactive un administrateur
   * @param {number} id - ID de l'administrateur
   */
  async toggleAdminActive(id) {
    return apiClient.post(`${ADMINS_ENDPOINT}/${id}/toggle_active/`);
  },

  /**
   * Supprime un administrateur
   * @param {number} id - ID de l'administrateur
   */
  async deleteAdmin(id) {
    return apiClient.delete(`${ADMINS_ENDPOINT}/${id}/`);
  },
};

export default adminService;
