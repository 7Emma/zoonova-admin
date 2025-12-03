/**
 * Service de gestion des vidéos de livres (upload de fichiers)
 * API: /api/v1/book-videos/
 * Gère l'upload de fichiers vidéo
 */

import apiClient from './api';

const BOOK_VIDEOS_ENDPOINT = '/book-videos';

export const bookVideosService = {
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
    return apiClient.get(`${BOOK_VIDEOS_ENDPOINT}/${query}`);
  },

  /**
   * Récupère les vidéos d'un livre spécifique
   * @param {number} bookId - ID du livre
   * @returns {Promise} Liste des vidéos du livre
   */
  async getVideosByBook(bookId) {
    return this.getVideos({ book: bookId });
  },

  /**
   * Récupère les détails d'une vidéo spécifique
   * @param {number} id - ID de la vidéo
   * @returns {Promise} Détails de la vidéo
   */
  async getVideoById(id) {
    return apiClient.get(`${BOOK_VIDEOS_ENDPOINT}/${id}/`);
  },

  /**
   * Crée une vidéo avec upload de fichier
   * @param {Object} data - Données de la vidéo
   * @param {number} data.book - ID du livre
   * @param {File} data.video_file - Fichier vidéo à uploader
   * @param {string} data.title - Titre de la vidéo (optionnel)
   * @param {string} data.description - Description de la vidéo (optionnel)
   * @param {number} data.order - Ordre d'affichage (optionnel)
   * @returns {Promise} Vidéo créée
   */
  async createVideo(data) {
    const formData = new FormData();
    
    formData.append('book', data.book);
    if (data.video_file) {
      formData.append('video_file', data.video_file);
    }
    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.order !== undefined) {
      formData.append('order', data.order);
    }

    return apiClient.post(`${BOOK_VIDEOS_ENDPOINT}/`, formData, {
      contentType: 'multipart/form-data',
    });
  },

  /**
   * Met à jour partiellement une vidéo (PATCH)
   * @param {number} id - ID de la vidéo
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} Vidéo mise à jour
   */
  async partialUpdateVideo(id, data) {
    const formData = new FormData();
    
    if (data.video_file) {
      formData.append('video_file', data.video_file);
    }
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    if (data.order !== undefined) {
      formData.append('order', data.order);
    }

    return apiClient.patch(`${BOOK_VIDEOS_ENDPOINT}/${id}/`, formData, {
      contentType: 'multipart/form-data',
    });
  },

  /**
   * Supprime une vidéo
   * @param {number} id - ID de la vidéo
   * @returns {Promise} Vide
   */
  async deleteVideo(id) {
    return apiClient.delete(`${BOOK_VIDEOS_ENDPOINT}/${id}/`);
  },

  /**
   * Valide qu'un fichier est un format vidéo accepté
   * @param {File} file - Fichier à valider
   * @returns {boolean} True si valide, False sinon
   */
  isValidVideoFile(file) {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    return file && validTypes.includes(file.type);
  },

  /**
   * Valide la taille du fichier vidéo (max 500MB)
   * @param {File} file - Fichier à valider
   * @returns {boolean} True si valide, False sinon
   */
  isValidVideoSize(file) {
    const maxSize = 500 * 1024 * 1024; // 500MB
    return file && file.size <= maxSize;
  },
};

export default bookVideosService;
