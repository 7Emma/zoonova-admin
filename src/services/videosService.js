/**
 * Service de gestion des vidéos de livres
 * API: /api/v1/books/videos/
 * Gère les opérations CRUD directes sur les vidéos sans passer par un livre
 * Supporte YouTube et Vimeo uniquement
 */

import apiClient from './api';

const VIDEOS_ENDPOINT = '/books/videos';

export const videosService = {
  /**
   * Récupère la liste paginée de toutes les vidéos
   * @param {Object} filters - Paramètres de filtrage
   * @param {number} filters.book - Filtrer par ID du livre
   * @param {number} filters.page - Numéro de page
   * @returns {Promise} Liste paginée des vidéos
   */
  async getVideos(filters = {}) {
    const params = new URLSearchParams();

    if (filters.book) {
      params.append('book', filters.book);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`${VIDEOS_ENDPOINT}/${query}`);
  },

  /**
   * Récupère les détails d'une vidéo spécifique
   * @param {number} id - ID de la vidéo
   * @returns {Promise} Détails de la vidéo
   */
  async getVideoById(id) {
    return apiClient.get(`${VIDEOS_ENDPOINT}/${id}/`);
  },

  /**
   * Crée une vidéo directement
   * @param {Object} data - Données de la vidéo
   * @param {number} data.book - ID du livre
   * @param {string} data.video_url - URL YouTube ou Vimeo
   * @param {string} data.title - Titre de la vidéo
   * @param {string} data.description - Description de la vidéo
   * @param {number} data.order - Ordre d'affichage (optionnel)
   * @returns {Promise} Vidéo créée
   */
  async createVideo(data) {
    return apiClient.post(`${VIDEOS_ENDPOINT}/`, data);
  },

  /**
   * Met à jour complètement une vidéo (PUT)
   * @param {number} id - ID de la vidéo
   * @param {Object} data - Données complètes de la vidéo
   * @returns {Promise} Vidéo mise à jour
   */
  async updateVideo(id, data) {
    return apiClient.put(`${VIDEOS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Met à jour partiellement une vidéo (PATCH)
   * @param {number} id - ID de la vidéo
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} Vidéo mise à jour
   */
  async partialUpdateVideo(id, data) {
    return apiClient.patch(`${VIDEOS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Supprime une vidéo
   * @param {number} id - ID de la vidéo
   * @returns {Promise} Vide
   */
  async deleteVideo(id) {
    return apiClient.delete(`${VIDEOS_ENDPOINT}/${id}/`);
  },

  /**
   * Valide qu'une URL est une URL YouTube ou Vimeo valide
   * @param {string} url - URL à valider
   * @returns {boolean} True si valide, False sinon
   */
  isValidVideoUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return (
        hostname.includes('youtube.com') ||
        hostname.includes('youtu.be') ||
        hostname.includes('vimeo.com')
      );
    } catch {
      return false;
    }
  },
};

export default videosService;
