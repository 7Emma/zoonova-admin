/**
 * Service pour la gestion des pays (Countries)
 * Gère la récupération des pays actifs et leurs informations
 */

import apiClient from './api';

const COUNTRIES_ENDPOINT = '/orders/countries';

class CountriesService {
  /**
   * Récupère la liste paginée de tous les pays actifs (Public)
   * @param {Object} options - Options de requête
   * @param {number} options.page - Numéro de page
   * @returns {Promise<Object>} Liste paginée des pays
   */
  async getCountries(options = {}) {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);

    const queryString = params.toString();
    const endpoint = queryString ? `${COUNTRIES_ENDPOINT}/?${queryString}` : `${COUNTRIES_ENDPOINT}/`;

    return apiClient.get(endpoint);
  }

  /**
    * Récupère les détails d'un pays spécifique (Public)
    * @param {number} countryId - ID du pays
    * @returns {Promise<Object>} Détails du pays
    */
  async getCountry(countryId) {
    return apiClient.get(`${COUNTRIES_ENDPOINT}/${countryId}/`);
  }

  /**
   * Cache pour stocker la liste des pays
   */
  _countriesCache = null;
  _cacheTimestamp = null;
  _cacheDuration = 60 * 60 * 1000; // 1 heure

  /**
   * Récupère tous les pays avec cache
   * @param {boolean} forceRefresh - Force le rafraîchissement du cache
   * @returns {Promise<Array>} Liste de tous les pays actifs
   */
  async getAllCountriesWithCache(forceRefresh = false) {
    const now = Date.now();
    
    if (
      !forceRefresh &&
      this._countriesCache &&
      this._cacheTimestamp &&
      now - this._cacheTimestamp < this._cacheDuration
    ) {
      return this._countriesCache;
    }

    try {
      const response = await this.getCountries();
      const allCountries = [];
      let nextPage = 1;
      let hasNext = true;

      // Récupère toutes les pages
      while (hasNext && nextPage <= 10) {
        const pageResponse = await this.getCountries({ page: nextPage });
        allCountries.push(...pageResponse.results);
        hasNext = !!pageResponse.next;
        nextPage++;
      }

      // Met en cache
      this._countriesCache = allCountries;
      this._cacheTimestamp = now;

      return allCountries;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  }

  /**
   * Récupère le nom d'un pays par son ID
   * @param {number} countryId - ID du pays
   * @returns {Promise<string>} Nom du pays
   */
  async getCountryName(countryId) {
    try {
      const country = await this.getCountry(countryId);
      return country.name;
    } catch (error) {
      console.error(`Erreur lors de la récupération du pays ${countryId}:`, error);
      return null;
    }
  }

  /**
   * Récupère les frais de port d'un pays
   * @param {number} countryId - ID du pays
   * @returns {Promise<number>} Frais de port en centimes
   */
  async getShippingCost(countryId) {
    try {
      const country = await this.getCountry(countryId);
      return country.shipping_cost;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des frais de port pour le pays ${countryId}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Vide le cache
   */
  clearCache() {
    this._countriesCache = null;
    this._cacheTimestamp = null;
  }
}

export default new CountriesService();
