import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Tableau d'affichage des livres pour l'admin
 * Permet d'afficher et gérer les livres
 */
export default function BooksList({ books, isLoading, onDelete, onToggleFeatured, onToggleActive }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Aucun livre trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* En-tête */}
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Titre</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Auteur</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Prix</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-900">Statut</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          {/* Corps */}
          <tbody className="divide-y">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{book.titre}</div>
                  <div className="text-gray-500">{book.slug}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{book.nom}</td>
                <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                  {book.prix_euros}€
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      book.in_stock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.quantites}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {book.is_active && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        Actif
                      </span>
                    )}
                    {book.is_featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        En avant
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* Bouton modifier */}
                    <Link
                      to={`/admin/books/${book.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Modifier
                    </Link>

                    {/* Bouton basculer en avant */}
                    <button
                      onClick={() => onToggleFeatured?.(book.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        book.is_featured
                          ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {book.is_featured ? 'Ôter' : 'Avant'}
                    </button>

                    {/* Bouton basculer actif */}
                    <button
                      onClick={() => onToggleActive?.(book.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        book.is_active
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {book.is_active ? 'Désactiver' : 'Activer'}
                    </button>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer "${book.titre}" ?`)) {
                          onDelete?.(book.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
