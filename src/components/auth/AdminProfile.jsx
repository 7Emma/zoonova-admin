import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService, apiClient, ApiError } from '../../services';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      setAdminData(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError('');
      // Appel API pour mettre à jour le profil
      const response = await apiClient.patch(
        `/auth/admins/${adminData.id}/`,
        formData
      );
      
      const updatedAdmin = {
        ...adminData,
        ...response,
      };
      setAdminData(updatedAdmin);
      updateUser(updatedAdmin);
      setEditMode(false);
    } catch (err) {
      console.error('Erreur de mise à jour:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Profil</h2>

      {error && <Alert type="error" message={error} />}

      {adminData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Prénom
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-700">{adminData.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-700">{adminData.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <p className="text-gray-700">{adminData.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Statut
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  adminData.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {adminData.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rôle
              </label>
              <div className="space-y-1">
                {adminData.is_superuser && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                    Superuser
                  </span>
                )}
                {adminData.is_staff && !adminData.is_superuser && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Staff
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-600">
              Inscrit depuis:{' '}
              <strong>{new Date(adminData.date_joined).toLocaleDateString('fr-FR')}</strong>
            </p>
            {adminData.last_login && (
              <p className="text-xs text-gray-600 mt-2">
                Dernière connexion:{' '}
                <strong>{new Date(adminData.last_login).toLocaleDateString('fr-FR')}</strong>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium"
              >
                Modifier le profil
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
