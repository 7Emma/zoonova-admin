/**
 * Service pour gérer les messages de contact
 * Endpoints: /api/v1/contact/messages/
 */

import { apiClient } from './api';

const CONTACT_ENDPOINT = '/contact/messages/';

/**
 * Service ContactService
 */
class ContactService {
  /**
   * Crée un nouveau message de contact (public)
   * @param {Object} data - Données du formulaire
   * @param {string} data.first_name - Prénom (requis, max 255)
   * @param {string} data.last_name - Nom (requis, max 255)
   * @param {string} data.email - Email (requis, format valide)
   * @param {string} data.subject - Sujet (optionnel, max 255)
   * @param {string} data.message - Message (requis, min 10 caractères)
   * @returns {Promise<Object>} Réponse avec message et données créées
   */
  createMessage(data) {
    return apiClient.post(CONTACT_ENDPOINT, data);
  }

  /**
   * Récupère la liste paginée des messages (Admin seulement)
   * @param {Object} params - Paramètres de filtrage
   * @param {boolean} params.unread_only - Filtrer uniquement non lus
   * @param {boolean} params.is_read - Filtrer par statut de lecture
   * @param {string} params.search - Recherche texte
   * @param {string} params.ordering - Tri (-created_at par défaut)
   * @param {number} params.page - Numéro de page
   * @returns {Promise<Object>} Liste paginée des messages
   */
  getMessages(params = {}) {
    return apiClient.get(CONTACT_ENDPOINT, { params });
  }

  /**
   * Récupère un message spécifique (Admin seulement)
   * @param {number} id - ID du message
   * @returns {Promise<Object>} Détails du message
   */
  getMessage(id) {
    return apiClient.get(`${CONTACT_ENDPOINT}${id}/`);
  }

  /**
   * Met à jour complètement un message (Admin seulement)
   * @param {number} id - ID du message
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise<Object>} Message mis à jour
   */
  updateMessage(id, data) {
    return apiClient.put(`${CONTACT_ENDPOINT}${id}/`, data);
  }

  /**
   * Met à jour partiellement un message (Admin seulement)
   * @param {number} id - ID du message
   * @param {Object} data - Champs à mettre à jour partiellement
   * @returns {Promise<Object>} Message mis à jour
   */
  patchMessage(id, data) {
    return apiClient.patch(`${CONTACT_ENDPOINT}${id}/`, data);
  }

  /**
   * Supprime un message (Admin seulement)
   * @param {number} id - ID du message
   * @returns {Promise<void>}
   */
  deleteMessage(id) {
    return apiClient.delete(`${CONTACT_ENDPOINT}${id}/`);
  }

  /**
   * Marque un message comme lu (Admin seulement)
   * @param {number} id - ID du message
   * @returns {Promise<Object>} Message mis à jour
   */
  markAsRead(id) {
    return apiClient.post(`${CONTACT_ENDPOINT}${id}/mark_as_read/`);
  }

  /**
   * Marque un message comme non lu (Admin seulement)
   * @param {number} id - ID du message
   * @returns {Promise<Object>} Message mis à jour
   */
  markAsUnread(id) {
    return apiClient.post(`${CONTACT_ENDPOINT}${id}/mark_as_unread/`);
  }

  /**
   * Marque un message comme répondu (Admin seulement)
   * @param {number} id - ID du message
   * @param {Object} data - Données optionnelles
   * @param {string} data.admin_notes - Notes admin optionnelles
   * @returns {Promise<Object>} Message mis à jour avec replied_at et is_read = true
   */
  markAsReplied(id, data = {}) {
    return apiClient.post(`${CONTACT_ENDPOINT}${id}/mark_as_replied/`, data);
  }

  /**
   * Récupère les statistiques des messages (Admin seulement)
   * @returns {Promise<Object>} Statistiques avec total, unread, replied, pending
   */
  getStatistics() {
    return apiClient.get(`${CONTACT_ENDPOINT}statistics/`);
  }

  /**
   * Marque plusieurs messages comme lus (Admin seulement)
   * @param {Array<number>} messageIds - IDs des messages
   * @returns {Promise<Object>} Réponse avec nombre de messages mis à jour
   */
  bulkMarkAsRead(messageIds) {
    return apiClient.post(`${CONTACT_ENDPOINT}/bulk_mark_as_read/`, {
      message_ids: messageIds,
    });
  }
}

// Exporte une instance unique du service
export const contactService = new ContactService();
export default contactService;
