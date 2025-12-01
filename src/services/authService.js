/**
 * Service d'authentification
 * Gère la connexion, l'enregistrement et la gestion des mots de passe
 */

import apiClient from './api';

const AUTH_ENDPOINT = '/auth';

export const authService = {
  /**
   * Connexion d'un administrateur
   * @param {string} email - Email de l'administrateur
   * @param {string} password - Mot de passe de l'administrateur
   */
  async login(email, password) {
    const response = await apiClient.post(`${AUTH_ENDPOINT}/login/`, {
      email,
      password,
    });

    if (response.user && response.access && response.refresh) {
      apiClient.setTokens(response.access, response.refresh);
      apiClient.setUser(response.user);
    }

    return response;
  },

  /**
   * Déconnexion
   */
  logout() {
    apiClient.logout();
  },

  /**
   * Définir le mot de passe initial
   * @param {Object} data - Données du mot de passe initial
   * @param {string} data.email - Email de l'administrateur
   * @param {string} data.password - Nouveau mot de passe
   * @param {string} data.password_confirm - Confirmation du mot de passe
   * @param {string} data.first_name - Prénom
   * @param {string} data.last_name - Nom de famille
   */
  async setPassword(data) {
    const response = await apiClient.post(`${AUTH_ENDPOINT}/set-password/`, data);

    if (response.user && response.tokens?.access && response.tokens?.refresh) {
      apiClient.setTokens(response.tokens.access, response.tokens.refresh);
      apiClient.setUser(response.user);
    }

    return response;
  },

  /**
   * Demander une réinitialisation de mot de passe
   * @param {string} email - Email de l'administrateur
   */
  async requestPasswordReset(email) {
    return apiClient.post(`${AUTH_ENDPOINT}/password-reset/request/`, {
      email,
    });
  },

  /**
   * Confirmer la réinitialisation de mot de passe
   * @param {Object} data - Données de réinitialisation
   * @param {string} data.token - Token de réinitialisation
   * @param {string} data.password - Nouveau mot de passe
   * @param {string} data.password_confirm - Confirmation du mot de passe
   */
  async confirmPasswordReset(data) {
    return apiClient.post(`${AUTH_ENDPOINT}/password-reset/confirm/`, data);
  },

  /**
   * Rafraîchir le token d'accès
   * @param {string} refreshToken - Token de rafraîchissement
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post(`${AUTH_ENDPOINT}/token/refresh/`, {
      refresh: refreshToken,
    });

    if (response.access) {
      apiClient.setTokens(response.access, refreshToken);
    }

    return response;
  },

  /**
   * Changer son mot de passe
   * @param {Object} data - Ancien et nouveau mot de passe
   * @param {string} data.old_password - Mot de passe actuel
   * @param {string} data.new_password - Nouveau mot de passe
   */
  async changePassword(data) {
    return apiClient.post(`${AUTH_ENDPOINT}/admins/change_password/`, data);
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  async getCurrentUser() {
    const response = await apiClient.get(`${AUTH_ENDPOINT}/admins/me/`);
    apiClient.setUser(response);
    return response;
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return apiClient.isAuthenticated();
  },

  /**
   * Récupère l'utilisateur actuel stocké en local
   */
  getLocalUser() {
    return apiClient.getUser();
  },

  /**
   * Récupère les tokens stockés
   */
  getTokens() {
    return apiClient.getTokens();
  },

  /**
   * Récupère toutes les sessions actives de l'utilisateur
   */
  async getSessions() {
    return apiClient.get(`${AUTH_ENDPOINT}/sessions/`);
  },

  /**
   * Invalide une session spécifique
   * @param {number} sessionId - ID de la session à invalider
   */
  async invalidateSession(sessionId) {
    return apiClient.post(`${AUTH_ENDPOINT}/sessions/`, {
      session_id: sessionId,
    });
  },

  /**
   * Invalide toutes les sessions actives
   */
  async logoutAllDevices() {
    return apiClient.delete(`${AUTH_ENDPOINT}/sessions/`);
  },
};

export default authService;
