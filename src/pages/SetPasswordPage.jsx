import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { authService, ApiError } from '../services';

export default function SetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email || '';
  const [formData, setFormData] = useState({
    email: email,
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Vérifier la correspondance des mots de passe
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

    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.setPassword({
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (response.tokens && response.user) {
        login(response.user, response.tokens.access, response.tokens.refresh);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.error === 'password_already_set') {
          setError('Le mot de passe a déjà été défini. Connectez-vous ou demandez une réinitialisation.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors de la définition du mot de passe');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavbar>
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Définir le mot de passe</h1>
          <p className="text-center text-gray-600 mb-8">
            Complétez votre profil et définissez votre mot de passe
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mot de passe
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
              {isLoading ? 'Définition en cours...' : 'Définir le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
