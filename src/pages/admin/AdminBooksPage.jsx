import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { booksService, ApiError } from '../../services';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLangue, setFilterLangue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const langues = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];

  // Charger les livres au mount et quand les filtres changent
  useEffect(() => {
    fetchBooks();
  }, [filterLangue, filterStatus, searchTerm]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await booksService.getBooks({
        ...(filterLangue && { langue: filterLangue }),
        search: searchTerm,
      });

      // Adapter la réponse API
      let adaptedBooks = await Promise.all(
        response.results.map(async (book) => {
          // Charger les détails complets pour obtenir is_active
          try {
            const fullBook = await booksService.getBookById(book.id);
            return {
              id: book.id,
              title: book.titre,
              author: book.nom,
              price: parseFloat((book.prix / 100).toFixed(2)),
              stock: book.quantites,
              active: fullBook.is_active,
              featured: fullBook.is_featured,
              cover: book.main_image,
            };
          } catch {
            // Fallback si le détail ne peut pas être chargé
            return {
              id: book.id,
              title: book.titre,
              author: book.nom,
              price: parseFloat((book.prix / 100).toFixed(2)),
              stock: book.quantites,
              active: true,
              featured: book.is_featured,
              cover: book.main_image,
            };
          }
        })
      );

      // Appliquer le filtre de statut
      if (filterStatus === 'active') {
        adaptedBooks = adaptedBooks.filter((book) => book.active);
      } else if (filterStatus === 'inactive') {
        adaptedBooks = adaptedBooks.filter((book) => !book.active);
      }

      setBooks(adaptedBooks);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors du chargement'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id) => {
    setIsProcessing(true);
    try {
      await booksService.toggleActive(id);
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, active: !book.active } : book
        )
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la mise à jour'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFeatured = async (id) => {
    setIsProcessing(true);
    try {
      await booksService.toggleFeatured(id);
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, featured: !book.featured } : book
        )
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la mise à jour'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) return;

    setIsProcessing(true);
    try {
      await booksService.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la suppression'
      );
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Gestion des livres</h1>
        <Link
          to="/admin/books/new"
          className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-secondary transition text-sm sm:text-base whitespace-nowrap"
        >
          + Ajouter un livre
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          />
          <select
            value={filterLangue}
            onChange={(e) => setFilterLangue(e.target.value)}
            disabled={isLoading || isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          >
            <option value="">Toutes les langues</option>
            {langues.map((langue) => (
              <option key={langue} value={langue}>
                {langue}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={isLoading || isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : books.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Couverture</th>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Titre</th>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Auteur</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Prix</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Stock</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Statut</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Vedette</th>
                <th className="text-right px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-md mx-auto shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-14 sm:w-12 sm:h-16 bg-gray-200 rounded-md mx-auto flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">{book.title}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{book.author}</td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">{book.price}€</td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold ${
                        book.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {book.stock}
                    </span>
                  </td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={() => toggleActive(book.id)}
                      disabled={isProcessing}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold transition ${
                        book.active
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {book.active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={() => toggleFeatured(book.id)}
                      disabled={isProcessing}
                      className={`text-xl sm:text-2xl transition ${book.featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'} disabled:opacity-50`}
                    >
                      ★
                    </button>
                  </td>
                  <td className="text-center sm:text-right px-2 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-3">
                    <Link
                      to={`/admin/books/${book.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-0.5 sm:space-x-1 text-xs sm:text-sm"
                      title="Voir les détails"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="hidden sm:inline">Voir</span>
                    </Link>
                    <Link
                      to={`/admin/books/${book.id}/edit`}
                      className="text-primary hover:text-secondary font-semibold text-xs sm:text-sm"
                    >
                      Éditer
                    </Link>
                    <button
                      onClick={() => deleteBook(book.id)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50 text-xs sm:text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600">Aucun livre trouvé</p>
        </div>
      )}
    </>
  );
}
