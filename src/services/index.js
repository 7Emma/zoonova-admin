/**
 * Point d'entrée centralisé pour tous les services
 * Facilite les imports dans l'application
 */

export { default as apiClient } from './api';
export { default as authService } from './authService';
export { default as adminService } from './adminService';
export { default as booksService } from './booksService';
export { default as imagesService } from './imagesService';
export { default as videosService } from './videosService';
export { default as bookVideosService } from './bookVideosService';
export { default as contactService } from './contactService';
export { default as ordersService } from './ordersService';
export { default as countriesService } from './countriesService';
export { default as paymentsService } from './paymentsService';

// Exporte aussi les classes/erreurs utiles
export { ApiError } from './api';
