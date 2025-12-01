import React, { useState } from 'react';
import { authService, ApiError } from '../../services';
import Alert from '../Alert';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'new_password' || name === 'new_password_confirm') {
      const pwd = name === 'new_password' ? value : formData.new_password;
      const confirm = name === 'new_password_confirm' ? value : formData.new_password_confirm;
      setPasswordMatch(pwd === confirm && pwd !== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordMatch) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (!formData.old_password || !formData.new_password) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      setSuccess('Mot de passe modifié avec succès');
      setFormData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data?.error === 'invalid_password') {
          setError('Ancien mot de passe incorrect');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors du changement du mot de passe');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Changer le mot de passe</h2>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-600 mt-1">
            Minimum 8 caractères avec lettres, chiffres et caractères spéciaux
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="new_password_confirm"
            value={formData.new_password_confirm}
            onChange={handleChange}
            disabled={isLoading}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 ${
              passwordMatch && formData.new_password_confirm
                ? 'border-green-300 focus:ring-green-400'
                : !passwordMatch && formData.new_password_confirm
                ? 'border-red-300 focus:ring-red-400'
                : 'border-gray-300 focus:ring-primary'
            }`}
            placeholder="••••••••"
          />
          {formData.new_password_confirm && !passwordMatch && (
            <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !passwordMatch}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
        >
          {isLoading ? 'Modification en cours...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
}
