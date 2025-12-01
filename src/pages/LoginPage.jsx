import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { authService, ApiError } from '../services';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoginError, setFirstLoginError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFirstLoginError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      // Gère le cas de la première connexion
      if (response.error === 'first_login') {
        setFirstLoginError({
          email: response.email,
          message: response.message,
        });
        setIsLoading(false);
        return;
      }

      // Connexion réussie
      login(response.user, response.access, response.refresh);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.error === 'first_login') {
          setFirstLoginError({
            email: err.data.email,
            message: err.data.message,
          });
        } else if (err.data?.error === 'invalid_credentials') {
          setError('Email ou mot de passe incorrect');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavbar>
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Connexion Admin</h1>
          <p className="text-center text-gray-600 mb-8">
            Connectez-vous à votre compte administrateur ZOONOVA
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {firstLoginError && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-semibold mb-2">{firstLoginError.message}</p>
              <Link
                to="/set-password"
                state={{ email: firstLoginError.email }}
                className="text-orange-700 hover:text-orange-900 font-semibold transition"
              >
                Définir le mot de passe →
              </Link>
            </div>
          )}

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

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/password-reset/request"
                className="text-sm text-primary hover:text-secondary transition"
              >
                Mot de passe oublié?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
