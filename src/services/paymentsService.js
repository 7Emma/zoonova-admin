/**
 * Service pour la gestion des paiements Stripe
 * Gère la création de sessions de paiement et la confirmation
 */

import apiClient from './api';

const PAYMENTS_ENDPOINT = '/payments';

class PaymentsService {
  /**
   * Crée une session de paiement Stripe pour une commande
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Object>} Session Stripe avec URL de paiement
   */
  async createCheckoutSession(orderId) {
    return apiClient.post(
      `${PAYMENTS_ENDPOINT}/create-checkout/`,
      { order_id: orderId }
    );
  }

  /**
   * Confirme un paiement réussi
   * @param {Object} paymentData - Données du paiement
   * @param {string} paymentData.payment_intent_id - ID de l'intent Stripe
   * @param {number} paymentData.order_id - ID de la commande
   * @returns {Promise<Object>} Confirmation du paiement
   */
  async confirmPayment(paymentData) {
    return apiClient.post(
      `${PAYMENTS_ENDPOINT}/confirm/`,
      paymentData
    );
  }

  /**
   * Vérifie le statut du paiement d'une commande
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Object>} Statut du paiement et détails commande
   */
  async verifyPayment(orderId) {
    return apiClient.get(`${PAYMENTS_ENDPOINT}/verify/?order_id=${orderId}`);
  }

  /**
   * Récupère le statut d'une session de paiement
   * @param {string} sessionId - ID de la session Stripe
   * @returns {Promise<Object>} Statut de la session
   */
  async getSessionStatus(sessionId) {
    return apiClient.get(`${PAYMENTS_ENDPOINT}/session-status/${sessionId}/`);
  }

  /**
   * Annule un paiement
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Object>} Confirmation de l'annulation
   */
  async cancelPayment(orderId) {
    return apiClient.post(
      `${PAYMENTS_ENDPOINT}/cancel/`,
      { order_id: orderId }
    );
  }

  /**
   * Récupère la liste paginée des paiements Stripe (Admin)
   * @param {Object} options - Options de requête
   * @param {number} options.page - Numéro de page (défaut: 1)
   * @param {number} options.page_size - Taille de la page
   * @returns {Promise<Object>} Liste paginée des paiements
   */
  async listPayments(options = {}) {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.page_size) params.append('page_size', options.page_size);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${PAYMENTS_ENDPOINT}/stripe/?${queryString}` 
      : `${PAYMENTS_ENDPOINT}/stripe/`;

    return apiClient.get(endpoint);
  }

  /**
   * Récupère les détails d'un paiement spécifique (Admin)
   * @param {number} paymentId - ID du paiement
   * @returns {Promise<Object>} Détails complets du paiement
   */
  async getPayment(paymentId) {
    return apiClient.get(`${PAYMENTS_ENDPOINT}/stripe/${paymentId}/`);
  }

  /**
   * Récupère les statistiques de paiement (Admin)
   * @param {Object} options - Options de requête
   * @param {string} options.start_date - Date de début (YYYY-MM-DD)
   * @param {string} options.end_date - Date de fin (YYYY-MM-DD)
   * @returns {Promise<Object>} Statistiques des paiements
   */
  async getPaymentStatistics(options = {}) {
    const params = new URLSearchParams();
    
    if (options.start_date) params.append('start_date', options.start_date);
    if (options.end_date) params.append('end_date', options.end_date);

    const queryString = params.toString();
    const endpoint = queryString 
      ? `${PAYMENTS_ENDPOINT}/statistics/?${queryString}` 
      : `${PAYMENTS_ENDPOINT}/statistics/`;

    return apiClient.get(endpoint);
  }
}

export default new PaymentsService();
