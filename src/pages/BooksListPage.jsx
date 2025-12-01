import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { booksService, ApiError } from '../services';

export default function BooksListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [filters, setFilters] = useState({
    langue: '', // À la place de category
    minPrice: 0,
    maxPrice: 100,
    inStock: false,
    search: searchParams.get('search') || '',
  });

  const [sortBy, setSortBy] = useState('-created_at');

  const langues = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];

  // Initialiser les filtres avec les paramètres d'URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Charger les livres au changement de filtres ou page
  useEffect(() => {
    fetchBooks();
  }, [filters, currentPage, sortBy]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await booksService.getBooks({
        page: currentPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.langue && { langue: filters.langue }),
        ...(filters.minPrice && { min_price: filters.minPrice * 100 }),
        ...(filters.maxPrice && { max_price: filters.maxPrice * 100 }),
        ...(filters.inStock && { in_stock: true }),
        ordering: sortBy,
      });

      // Adapter la réponse API au format de la page
      const adaptedBooks = response.results.map((book) => ({
        id: book.id,
        title: book.titre,
        author: book.nom,
        price: parseFloat((book.prix / 100).toFixed(2)),
        rating: 4.5, // À adapter selon votre API
        reviews: book.sales_count || 0,
        category: book.langue,
        image: book.main_image,
        stock: book.quantites,
        in_stock: book.in_stock,
      }));

      setBooks(adaptedBooks);
      setTotalBooks(response.count);
      setTotalPages(Math.ceil(response.count / 12)); // 12 par page
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

  const handleFilterChange = (newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Filtres</h3>

            {/* Langue Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Langue
              </label>
              <select
                value={filters.langue}
                onChange={(e) => handleFilterChange({ langue: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
              >
                <option value="">Toutes les langues</option>
                {langues.map((langue) => (
                  <option key={langue} value={langue}>
                    {langue}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Prix: {filters.minPrice}€ - {filters.maxPrice}€
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange({ minPrice: parseInt(e.target.value) })}
                  disabled={isLoading}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange({ maxPrice: parseInt(e.target.value) })}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFilters({ langue: '', minPrice: 0, maxPrice: 100, inStock: false, search: '' });
                setCurrentPage(1);
                navigate('/books');
              }}
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition disabled:bg-gray-400"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Sort and Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {isLoading ? 'Chargement...' : `${totalBooks} résultats`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
            >
              <option value="-created_at">Plus récents</option>
              <option value="created_at">Plus anciens</option>
              <option value="prix">Prix: bas à haut</option>
              <option value="-prix">Prix: haut à bas</option>
              <option value="-sales_count">Plus vendus</option>
              <option value="views_count">Moins vus</option>
            </select>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <LoadingSpinner />
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                      ) : (
                        <span className="text-gray-400">Image livre</span>
                      )}
                      {!book.in_stock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Rupture</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-primary font-bold">{book.price}€</p>
                      </div>
                      <button
                        disabled={!book.in_stock}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition disabled:bg-gray-400"
                      >
                        {book.in_stock ? 'Ajouter au panier' : 'Indisponible'}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">Aucun livre ne correspond à vos critères</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
