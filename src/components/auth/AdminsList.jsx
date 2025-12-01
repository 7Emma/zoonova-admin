import React, { useState, useEffect } from 'react';
import { adminService, ApiError } from '../../services';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';

export default function AdminsList({ refresh = false, onRefreshComplete = null }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    is_active: null,
    is_superuser: null,
  });

  useEffect(() => {
    fetchAdmins();
  }, [filters, refresh]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const filterParams = {};
      if (filters.is_active !== null) filterParams.is_active = filters.is_active;
      if (filters.is_superuser !== null) filterParams.is_superuser = filters.is_superuser;

      const response = await adminService.getAllAdmins(filterParams);
      setAdmins(response.results || []);
      if (onRefreshComplete) onRefreshComplete();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement des administrateurs');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminActive = async (adminId, isCurrentlyActive) => {
    try {
      await adminService.toggleAdminActive(adminId);
      const newStatus = !isCurrentlyActive;
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === adminId ? { ...admin, is_active: newStatus } : admin
        )
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : `Erreur lors de la modification du statut`
      );
    }
  };

  const deleteAdmin = async (adminId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur?')) {
      return;
    }

    try {
      await adminService.deleteAdmin(adminId);
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Erreur lors de la suppression'
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              is_active: prev.is_active === null ? true : null,
            }))
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filters.is_active === true
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Actifs
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              is_active: prev.is_active === false ? false : null,
            }))
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filters.is_active === false
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Inactifs
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              is_superuser: prev.is_superuser === true ? null : true,
            }))
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filters.is_superuser === true
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Superusers
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Nom</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold">Rôle</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Aucun administrateur trouvé
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.full_name || `${admin.first_name} ${admin.last_name}`}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        admin.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {admin.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {admin.is_superuser && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Superuser
                      </span>
                    )}
                    {admin.is_staff && !admin.is_superuser && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Staff
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => toggleAdminActive(admin.id, admin.is_active)}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                      >
                        {admin.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        className="px-3 py-1 text-sm rounded-lg bg-red-200 hover:bg-red-300 transition text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
