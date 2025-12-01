import React, { useState } from 'react';

export default function AdminUsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer',
  });
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      role: 'customer',
      createdAt: '2024-01-15',
      active: true,
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      role: 'customer',
      createdAt: '2024-01-20',
      active: true,
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@email.com',
      role: 'staff',
      createdAt: '2023-12-01',
      active: true,
    },
    {
      id: 4,
      firstName: 'Sophie',
      lastName: 'Leclerc',
      email: 'sophie.leclerc@email.com',
      role: 'customer',
      createdAt: '2024-02-10',
      active: false,
    },
  ]);

  const toggleActive = (id) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, active: !user.active } : user
    ));
  };

  const deleteUser = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const toggleRole = (id) => {
    setUsers(users.map((user) =>
      user.id === id
        ? { ...user, role: user.role === 'customer' ? 'staff' : 'customer' }
        : user
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };

    setUsers([...users, newUser]);
    setFormData({ firstName: '', lastName: '', email: '', role: 'customer' });
    setShowModal(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Tous les rôles</option>
            <option>Client</option>
            <option>Staff</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">Nom</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">Email</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900">Rôle</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900">Date d'inscription</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900">Statut</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="text-center px-6 py-4">
                  <button
                    onClick={() => toggleRole(user.id)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      user.role === 'staff'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role === 'staff' ? 'Staff' : 'Client'}
                  </button>
                </td>
                <td className="text-center px-6 py-4 text-gray-600">{user.createdAt}</td>
                <td className="text-center px-6 py-4">
                  <button
                    onClick={() => toggleActive(user.id)}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      user.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.active ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="text-right px-6 py-4 space-x-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Ajouter un utilisateur</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jean"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Dupont"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean.dupont@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="customer">Client</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
