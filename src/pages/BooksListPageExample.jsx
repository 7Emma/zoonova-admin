import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { BookCard, BookFilters } from '../components/public';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { booksService, ApiError } from '../services';

/**
 * Page de liste des livres avec filtrage et pagination
 * EXEMPLE d'utilisation du booksService avec les composants publics
 */
export default function BooksListPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    langue: '',
    editeur: '',
    inStock: false,
    isFeatured: false,
    ordering: '-created_at',
  });

  // Charger les livres au changement de filtres ou page
  useEffect(() => {
    fetchBooks();
  }, [filters, currentPage]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Préparer les paramètres pour le service
      const apiFilters = {
        page: currentPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.minPrice && { min_price: parseInt(filters.minPrice) * 100 }),
        ...(filters.maxPrice && { max_price: parseInt(filters.maxPrice) * 100 }),
        ...(filters.langue && { langue: filters.langue }),
        ...(filters.editeur && { editeur: filters.editeur }),
        ...(filters.inStock && { in_stock: true }),
        ...(filters.isFeatured && { is_featured: true }),
        ordering: filters.ordering,
      };

      const response = await booksService.getBooks(apiFilters);

      setBooks(response.results || []);
      setTotalPages(Math.ceil(response.count / 12)); // Assuming 12 items per page
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Erreur lors du chargement des livres'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Livres</h1>
        <p className="text-gray-600 mb-8">
          Découvrez notre catalogue complet de livres
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres (colonne gauche) */}
          <div className="lg:col-span-1">
            <BookFilters onFilterChange={handleFilterChange} isLoading={isLoading} />
          </div>

          {/* Liste des livres (colonne droite) */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <LoadingSpinner />
            ) : books.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                )}
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600">
                  Aucun livre ne correspond à vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
