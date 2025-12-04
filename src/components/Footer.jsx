import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Footer() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">ZOONOVA</h3>
            <p className="text-sm text-gray-400 mb-4">
              ©Nacreale Editions
            </p>
            <p className="text-gray-400 text-sm">
              Votre librairie en ligne pour découvrir les meilleurs livres.
            </p>
          </div>

          {/* Découvrir */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Découvrir Nacreale Editions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-400 hover:text-primary transition text-sm">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition text-sm">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Mon compte</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary transition text-sm">
                  Mon panier
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/account/profile" className="text-gray-400 hover:text-primary transition text-sm">
                    Ma commande
                  </Link>
                </li>
              )}
              <li>
                <Link to="/politique-confidentialite" className="text-gray-400 hover:text-primary transition text-sm">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-400 hover:text-primary transition text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/conditions-ventes" className="text-gray-400 hover:text-primary transition text-sm">
                  Conditions de ventes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Rejoignez-nous sur</h4>
            <div className="flex space-x-4 mb-6">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.646-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </a>
            </div>

            <h4 className="text-lg font-semibold mb-4">Moyens de paiement</h4>
            <div className="flex space-x-3 items-center flex-wrap gap-2">
              {/* Visa */}
              <div className="bg-white rounded px-2 py-1">
                <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#1434CB"/>
                  <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
                </svg>
              </div>

              {/* Mastercard */}
              <div className="bg-white rounded px-2 py-1">
                <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#EB001B"/>
                  <circle cx="18" cy="16" r="8" fill="#FF5F00"/>
                  <circle cx="30" cy="16" r="8" fill="#FFAE00"/>
                </svg>
              </div>

              {/* American Express */}
              <div className="bg-white rounded px-2 py-1">
                <svg className="w-10 h-6" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#006FCF"/>
                  <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">AMEX</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Conception */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">Conception: <a href="mailto:limay.amboka@gmail.com" className="hover:text-primary transition">@ManuCoder</a></p>
          </div>
        </div>

        {/* Auth Section - Only Logout for Admins */}
        {isAuthenticated && (
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center mb-6">
              <button
                onClick={handleLogout}
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Déconnexion Admin
              </button>
            </div>

            {/* Bottom */}
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; Nacreale Editions 2024. Tous droits réservés.</p>
            </div>
          </div>
        )}

        {/* Bottom - No Auth Section */}
        {!isAuthenticated && (
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; Nacreale Editions 2024. Tous droits réservés.</p>
          </div>
        )}
      </div>
    </footer>
  );
}
