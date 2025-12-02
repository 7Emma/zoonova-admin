/**
 * Client API centralisé
 * Gère les requêtes HTTP vers l'API backend
 */

import axios from 'axios';

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

// Événement personnalisé pour la redirection sur 401
export const createAuthEvent = () => {
  return new Event('unauthorized');
};

/**
 * Classe client API pour gérer toutes les requêtes HTTP
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authBaseURL = AUTH_BASE_URL;
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    
    // Configuration d'axios
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  /**
   * Configure les headers par défaut
   */
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Effectue une requête HTTP générique
   */
  async request(endpoint, options = {}) {
    const baseURL = options.baseURL || this.baseURL;
    const config = {
      headers: this.getHeaders(options.contentType),
      baseURL,
    };

    // Exclude baseURL and contentType from spread options
    const { baseURL: _, contentType: __, ...axiosOptions } = options;
    
    try {
      const response = await this.axiosInstance.request({
        url: endpoint,
        ...config,
        ...axiosOptions,
      });

      return response.data;
    } catch (error) {
      // Gère le refresh token si le token d'accès a expiré
      if (error.response?.status === 401 && this.refreshToken) {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          this.accessToken = newAccessToken;
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return this.axiosInstance.request({
            url: endpoint,
            ...config,
            ...axiosOptions,
          }).then(res => res.data);
        } else {
          // Refresh token a échoué ou retourné null
          this.handleUnauthorized();
          throw new ApiError('Session expirée. Veuillez vous reconnecter.', 401, {});
        }
      }

      // Gère les erreurs 401 (non authentifié)
      if (error.response?.status === 401) {
        this.handleUnauthorized();
      }

      if (error instanceof ApiError) throw error;
      
      const errorData = error.response?.data || { error: error.message };
      const status = error.response?.status || 500;
      const message = errorData?.message || `HTTP Error: ${status}`;
      
      throw new ApiError(message, status, errorData);
    }
  }

  /**
   * Requête GET
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Requête POST
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data,
      ...options,
    });
  }

  /**
   * Requête PUT
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data,
      ...options,
    });
  }

  /**
   * Requête PATCH
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data,
      ...options,
    });
  }

  /**
   * Requête DELETE
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Rafraîchit le token d'accès
   */
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) return null;

      const response = await this.axiosInstance.post(`${this.authBaseURL}/token/refresh/`, {
        refresh: this.refreshToken,
      });

      const data = response.data;

      if (data.access) {
        this.accessToken = data.access;
        localStorage.setItem('access_token', data.access);
        return data.access;
      }

      // Token refresh a échoué, déconnecter l'utilisateur
      this.logout();
      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Stocke les tokens
   */
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Récupère les tokens stockés
   */
  getTokens() {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    };
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Gère les erreurs d'authentification (401)
   * Émet un événement que le contexte d'authentification peut écouter
   */
  handleUnauthorized() {
    this.logout();
    // Émet un événement personnalisé
    window.dispatchEvent(new Event('unauthorized'));
  }

  /**
   * Stocke les données utilisateur
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Récupère les données utilisateur stockées
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!this.accessToken;
  }
}

/**
 * Classe personnalisée pour les erreurs API
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Exporte une instance unique du client API
export const apiClient = new ApiClient();
export default apiClient;
export { ApiError };
