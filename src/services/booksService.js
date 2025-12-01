/**
 * Service de gestion des livres
 * API: /api/v1/books/
 * Gère CRUD complet et opérations spéciales sur les livres
 */

import apiClient from './api';

const BOOKS_ENDPOINT = '/books';

export const booksService = {
  /**
   * Récupère la liste paginée de tous les livres
   * @param {Object} filters - Paramètres de filtrage
   * @param {boolean} filters.is_featured - Livres mis en avant
   * @param {string} filters.langue - Langue du livre
   * @param {string} filters.editeur - Éditeur
   * @param {string} filters.search - Recherche texte
   * @param {string} filters.ordering - Tri: -created_at, prix, -prix, views_count, sales_count
   * @param {number} filters.min_price - Prix minimum (en centimes)
   * @param {number} filters.max_price - Prix maximum (en centimes)
   * @param {boolean} filters.in_stock - Filtrer en stock
   * @param {number} filters.page - Numéro de page
   * @returns {Promise} Liste paginée des livres
   */
  async getBooks(filters = {}) {
    const params = new URLSearchParams();

    if (filters.is_featured !== undefined) {
      params.append('is_featured', filters.is_featured);
    }
    if (filters.langue) {
      params.append('langue', filters.langue);
    }
    if (filters.editeur) {
      params.append('editeur', filters.editeur);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters.min_price !== undefined) {
      params.append('min_price', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      params.append('max_price', filters.max_price);
    }
    if (filters.in_stock !== undefined) {
      params.append('in_stock', filters.in_stock);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`${BOOKS_ENDPOINT}/${query}`);
  },

  /**
   * Récupère les détails complets d'un livre
   * Incrémente automatiquement le compteur de vues
   * @param {number} id - ID du livre
   * @returns {Promise} Détails du livre
   */
  async getBookById(id) {
    return apiClient.get(`${BOOKS_ENDPOINT}/${id}/`);
  },

  /**
   * Récupère un livre par son slug
   * @param {string} slug - Slug du livre
   * @returns {Promise} Détails du livre
   */
  async getBookBySlug(slug) {
    const response = await this.getBooks({ search: slug });
    if (response.results && response.results.length > 0) {
      return response.results[0];
    }
    throw new Error('Livre non trouvé');
  },

  /**
   * Crée un nouveau livre
   * @param {Object} data - Données du livre
   * @returns {Promise} Livre créé
   */
  async createBook(data) {
    return apiClient.post(`${BOOKS_ENDPOINT}/`, data);
  },

  /**
   * Met à jour complètement un livre (PUT)
   * @param {number} id - ID du livre
   * @param {Object} data - Toutes les données du livre
   * @returns {Promise} Livre mis à jour
   */
  async updateBook(id, data) {
    return apiClient.put(`${BOOKS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Met à jour partiellement un livre (PATCH)
   * @param {number} id - ID du livre
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise} Livre mis à jour
   */
  async partialUpdateBook(id, data) {
    return apiClient.patch(`${BOOKS_ENDPOINT}/${id}/`, data);
  },

  /**
   * Supprime un livre
   * @param {number} id - ID du livre
   * @returns {Promise} Vide (204 No Content)
   */
  async deleteBook(id) {
    return apiClient.delete(`${BOOKS_ENDPOINT}/${id}/`);
  },

  /**
   * Met à jour uniquement le stock d'un livre
   * @param {number} id - ID du livre
   * @param {number} quantites - Nouvelle quantité
   * @returns {Promise} Résultat avec message et book mis à jour
   */
  async updateStock(id, quantites) {
    return apiClient.patch(`${BOOKS_ENDPOINT}/${id}/update_stock/`, {
      quantites,
    });
  },

  /**
   * Active/désactive la mise en avant d'un livre
   * @param {number} id - ID du livre
   * @returns {Promise} Message de confirmation
   */
  async toggleFeatured(id) {
    return apiClient.post(`${BOOKS_ENDPOINT}/${id}/toggle_featured/`);
  },

  /**
   * Active/désactive la visibilité d'un livre
   * @param {number} id - ID du livre
   * @returns {Promise} Message de confirmation
   */
  async toggleActive(id) {
    return apiClient.post(`${BOOKS_ENDPOINT}/${id}/toggle_active/`);
  },

  /**
   * Récupère toutes les images d'un livre
   * @param {number} id - ID du livre
   * @returns {Promise} Liste des images
   */
  async getBookImages(id) {
    return apiClient.get(`${BOOKS_ENDPOINT}/${id}/images/`);
  },

  /**
   * Ajoute une image à un livre
   * @param {number} id - ID du livre
   * @param {FormData} formData - FormData avec image et infos
   * @returns {Promise} Image créée
   */
  async addBookImage(id, formData) {
    return apiClient.post(`${BOOKS_ENDPOINT}/${id}/add_image/`, formData, {
      contentType: 'multipart/form-data',
    });
  },

  /**
   * Supprime une image d'un livre
   * @param {number} bookId - ID du livre
   * @param {number} imageId - ID de l'image
   * @returns {Promise} Vide
   */
  async deleteBookImage(bookId, imageId) {
    return apiClient.delete(`${BOOKS_ENDPOINT}/${bookId}/images/${imageId}/`);
  },

  /**
   * Récupère toutes les vidéos d'un livre
   * @param {number} id - ID du livre
   * @returns {Promise} Liste des vidéos
   */
  async getBookVideos(id) {
    return apiClient.get(`${BOOKS_ENDPOINT}/${id}/videos/`);
  },

  /**
   * Ajoute une vidéo à un livre
   * @param {number} id - ID du livre
   * @param {Object} data - Données de la vidéo
   * @returns {Promise} Vidéo créée
   */
  async addBookVideo(id, data) {
    return apiClient.post(`${BOOKS_ENDPOINT}/${id}/add_video/`, data);
  },

  /**
   * Supprime une vidéo d'un livre
   * @param {number} bookId - ID du livre
   * @param {number} videoId - ID de la vidéo
   * @returns {Promise} Vide
   */
  async deleteBookVideo(bookId, videoId) {
    return apiClient.delete(`${BOOKS_ENDPOINT}/${bookId}/videos/${videoId}/`);
  },
};

export default booksService;
