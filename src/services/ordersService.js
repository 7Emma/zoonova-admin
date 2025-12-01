/**
 * Service pour la gestion des commandes (Orders)
 * Gère la création, récupération et mise à jour des commandes
 */

import apiClient from './api';

const ORDERS_ENDPOINT = '/orders';

class OrdersService {
  /**
   * Récupère la liste paginée de toutes les commandes (Admin)
   * @param {Object} options - Options de requête
   * @param {number} options.page - Numéro de page
   * @param {string} options.status - Filtrer par statut (pending, delivered)
   * @param {number} options.country - Filtrer par ID de pays
   * @param {string} options.start_date - Date de début (YYYY-MM-DD)
   * @param {string} options.end_date - Date de fin (YYYY-MM-DD)
   * @param {string} options.search - Recherche par email, prénom, nom, suivi
   * @param {string} options.ordering - Tri: -created_at, created_at, total, -total
   * @returns {Promise<Object>} Liste paginée des commandes
   */
  async getOrders(options = {}) {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.status) params.append('status', options.status);
    if (options.country) params.append('country', options.country);
    if (options.start_date) params.append('start_date', options.start_date);
    if (options.end_date) params.append('end_date', options.end_date);
    if (options.search) params.append('search', options.search);
    if (options.ordering) params.append('ordering', options.ordering);

    const queryString = params.toString();
    const endpoint = queryString ? `${ORDERS_ENDPOINT}/?${queryString}` : `${ORDERS_ENDPOINT}/`;

    return apiClient.get(endpoint);
  }

  /**
    * Crée une nouvelle commande (Public - pas d'authentification requise)
    * @param {Object} orderData - Données de la commande
    * @param {string} orderData.email - Email du client
    * @param {string} orderData.first_name - Prénom
    * @param {string} orderData.last_name - Nom
    * @param {string} orderData.phone - Téléphone (optionnel)
    * @param {string} orderData.voie - Rue
    * @param {string} orderData.numero_voie - Numéro de rue
    * @param {string} orderData.complement_adresse - Complément d'adresse (optionnel)
    * @param {string} orderData.code_postal - Code postal
    * @param {string} orderData.ville - Ville
    * @param {number} orderData.country - ID du pays
    * @param {Array<{book_id: number, quantity: number}>} orderData.items - Articles de la commande
    * @returns {Promise<Object>} Commande créée avec tous les détails
    */
  async createOrder(orderData) {
    return apiClient.post(`${ORDERS_ENDPOINT}/`, orderData);
  }

  /**
    * Récupère les détails complets d'une commande (Admin)
    * @param {number} orderId - ID de la commande
    * @returns {Promise<Object>} Détails complets de la commande
    */
  async getOrder(orderId) {
    return apiClient.get(`${ORDERS_ENDPOINT}/${orderId}/`);
  }

  /**
    * Met à jour complètement une commande (Admin)
    * @param {number} orderId - ID de la commande
    * @param {Object} orderData - Données à mettre à jour
    * @returns {Promise<Object>} Commande mise à jour
    */
  async updateOrder(orderId, orderData) {
    return apiClient.put(`${ORDERS_ENDPOINT}/${orderId}/`, orderData);
  }

  /**
    * Met à jour partiellement une commande (Admin)
    * @param {number} orderId - ID de la commande
    * @param {Object} orderData - Données à mettre à jour partiellement
    * @returns {Promise<Object>} Commande mise à jour
    */
  async partialUpdateOrder(orderId, orderData) {
    return apiClient.patch(`${ORDERS_ENDPOINT}/${orderId}/`, orderData);
  }

  /**
    * Supprime une commande (Admin)
    * @param {number} orderId - ID de la commande
    * @returns {Promise<void>}
    */
  async deleteOrder(orderId) {
    return apiClient.delete(`${ORDERS_ENDPOINT}/${orderId}/`);
  }

  /**
   * Met à jour le statut d'une commande avec logique métier (Admin)
   * @param {number} orderId - ID de la commande
   * @param {Object} statusData - Données de statut
   * @param {string} statusData.status - Nouveau statut (pending, delivered)
   * @param {string} statusData.tracking_number - Numéro de suivi (requis si delivered)
   * @param {string} statusData.notes - Notes optionnelles
   * @returns {Promise<Object>} Commande avec statut mis à jour
   */
  async updateOrderStatus(orderId, statusData) {
    return apiClient.patch(
      `${ORDERS_ENDPOINT}/${orderId}/update_status/`,
      statusData
    );
  }

  /**
   * Récupère les statistiques des commandes (Admin)
   * @returns {Promise<Object>} Statistiques globales
   */
  async getStatistics() {
    return apiClient.get(`${ORDERS_ENDPOINT}/statistics/`);
  }

  /**
   * Télécharge la facture PDF d'une commande (Admin)
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Blob>} Fichier PDF de la facture
   */
  async downloadInvoice(orderId) {
    return apiClient.get(`${ORDERS_ENDPOINT}/${orderId}/invoice/`, {
      responseType: 'blob',
    });
  }
}

export default new OrdersService();
