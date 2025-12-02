import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { authService, ApiError } from '../services';

export default function PasswordResetConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token') || '';
  const [formData, setFormData] = useState({
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  if (!token) {
    return (
      <MainLayout hideNavbar hideFooter>
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              Lien de réinitialisation invalide ou expiré
            </div>
            <Link
              to="/password-reset/request"
              className="text-primary hover:text-secondary font-semibold transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' || name === 'password_confirm') {
      const pwd = name === 'password' ? value : formData.password;
      const confirm = name === 'password_confirm' ? value : formData.password_confirm;
      setPasswordMatch(pwd === confirm && pwd !== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordMatch) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.password) {
      setError('Le mot de passe est obligatoire');
      return;
    }

    setIsLoading(true);

    try {
      await authService.confirmPasswordReset({
        token,
        password: formData.password,
        password_confirm: formData.password_confirm,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.error === 'token_expired') {
          setError('Le lien de réinitialisation a expiré. Demandez un nouveau lien.');
        } else if (err.data?.error === 'invalid_token') {
          setError('Lien de réinitialisation invalide. Demandez un nouveau lien.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors de la réinitialisation du mot de passe');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavbar hideFooter>
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Nouveau mot de passe
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Entrez votre nouveau mot de passe
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">Mot de passe réinitialisé</p>
              <p className="text-green-700 text-sm mt-2">
                Redirection vers la connexion...
              </p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Minimum 8 caractères avec lettres, chiffres et caractères spéciaux
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 ${
                    passwordMatch && formData.password_confirm
                      ? 'border-green-300 focus:ring-green-400'
                      : !passwordMatch && formData.password_confirm
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-primary'
                  }`}
                  placeholder="••••••••"
                />
                {formData.password_confirm && !passwordMatch && (
                  <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !passwordMatch}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
              >
                {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/password-reset/request"
              className="text-sm text-primary hover:text-secondary font-semibold transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
