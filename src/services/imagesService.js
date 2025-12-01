/**
 * Service de gestion des images de livres
 * API: /api/v1/books/images/
 * Gère les opérations CRUD directes sur les images sans passer par un livre
 */

import apiClient from './api';

const IMAGES_ENDPOINT = '/books/images';

export const imagesService = {
  /**
   * Récupère la liste paginée de toutes les images
   * @param {Object} filters - Paramètres de filtrage
   * @param {number} filters.book - Filtrer par ID du livre
   * @param {string} filters.type - Filtrer par type (cover_front, cover_back, content, other)
   * @param {number} filters.page - Numéro de page
   * @returns {Promise} Liste paginée des images
   */
  async getImages(filters = {}) {
    const params = new URLSearchParams();

    if (filters.book) {
      params.append('book', filters.book);
    }
    if (filters.type) {
      params.append('type', filters.type);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`${IMAGES_ENDPOINT}/${query}`);
  },

  /**
   * Récupère les détails d'une image spécifique
   * @param {number} id - ID de l'image
   * @returns {Promise} Détails de l'image
   */
  async getImageById(id) {
    return apiClient.get(`${IMAGES_ENDPOINT}/${id}/`);
  },

  /**
   * Crée une image directement
   * @param {FormData} formData - FormData avec image et infos (book, image, type, etc.)
   * @returns {Promise} Image créée
   */
  async createImage(formData) {
    return apiClient.post(`${IMAGES_ENDPOINT}/`, formData, {
      contentType: 'multipart/form-data',
    });
  },

  /**
   * Met à jour complètement une image (PUT)
   * @param {number} id - ID de l'image
   * @param {FormData} formData - Données complètes avec image
   * @returns {Promise} Image mise à jour
   */
  async updateImage(id, formData) {
    return apiClient.put(`${IMAGES_ENDPOINT}/${id}/`, formData, {
      contentType: 'multipart/form-data',
    });
  },

  /**
   * Met à jour partiellement une image (PATCH)
   * @param {number} id - ID de l'image
   * @param {Object} data - Données à mettre à jour (JSON)
   * @returns {Promise} Image mise à jour
   */
  async partialUpdateImage(id, data) {
    return apiClient.patch(`${IMAGES_ENDPOINT}/${id}/`, data);
  },

  /**
   * Supprime une image
   * @param {number} id - ID de l'image
   * @returns {Promise} Vide
   */
  async deleteImage(id) {
    return apiClient.delete(`${IMAGES_ENDPOINT}/${id}/`);
  },

  /**
   * Définit une image comme couverture principale
   * Les autres images du même livre perdent ce statut automatiquement
   * @param {number} id - ID de l'image
   * @returns {Promise} Message de confirmation avec image mise à jour
   */
  async setMainCover(id) {
    return apiClient.post(`${IMAGES_ENDPOINT}/${id}/set_main_cover/`);
  },
};

export default imagesService;
