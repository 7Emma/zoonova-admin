import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { authService, ApiError } from '../services';

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      } else {
        setError('Erreur lors de la demande de réinitialisation');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavbar>
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Réinitialiser le mot de passe
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">Email envoyé</p>
              <p className="text-green-700 text-sm mb-4">
                Vérifiez votre boîte de réception pour le lien de réinitialisation (expire dans 1 heure)
              </p>
              <Link
                to="/login"
                className="text-green-700 hover:text-green-900 font-semibold transition text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                  placeholder="admin@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary hover:text-secondary font-semibold transition text-sm"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
