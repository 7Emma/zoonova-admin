import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // TODO: Call API to delete account
    alert('Compte supprimé');
    logout();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Mon profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Informations personnelles</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Prénom</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.first_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Nom</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.last_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Adresses sauvegardées</h2>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">Adresse {i}</p>
                        <p className="text-gray-600">123 Rue de la Paix</p>
                        <p className="text-gray-600">75000 Paris, France</p>
                      </div>
                      <button className="text-primary hover:text-secondary font-semibold">
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                + Ajouter une adresse
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-6 text-gray-900">Actions</h3>

              <div className="space-y-3">
                <Link
                  to="/account/orders"
                  className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Voir mes commandes
                </Link>

                <Link
                  to="/account/change-password"
                  className="block w-full text-center border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition font-semibold"
                >
                  Changer le mot de passe
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-semibold"
                >
                  Déconnexion
                </button>
              </div>

              <hr className="my-6" />

              <div>
                <p className="text-sm text-gray-600 mb-3">Zone danger</p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Supprimer mon compte?</h3>
              <p className="text-gray-600 mb-6">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
