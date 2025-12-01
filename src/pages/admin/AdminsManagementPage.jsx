import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminsList, CreateAdminForm } from '../../components/auth';
import Alert from '../../components/Alert';

export default function AdminsManagementPage() {
  const { user } = useAuth();
  const [refreshList, setRefreshList] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Vérifier que l'utilisateur est superuser
  if (!user?.is_superuser) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert 
          type="error" 
          message="Vous n'avez pas les permissions pour accéder à cette page. Seuls les superusers peuvent gérer les administrateurs." 
        />
      </div>
    );
  }

  const handleAdminCreated = () => {
    setRefreshList(!refreshList);
    setActiveTab('list');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Gestion des Administrateurs</h1>
        <p className="text-gray-600 mt-2">Gérez les comptes administrateurs de ZOONOVA</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'list'
              ? 'text-primary border-primary'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Liste des administrateurs
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'create'
              ? 'text-primary border-primary'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Créer un administrateur
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <AdminsList refresh={refreshList} onRefreshComplete={() => setRefreshList(false)} />
      )}

      {activeTab === 'create' && (
        <CreateAdminForm onSuccess={handleAdminCreated} />
      )}
    </div>
  );
}
