import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { booksService, ApiError } from '../../services';

export default function AdminBookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await booksService.getBookById(parseInt(id));

      setBook({
        id: data.id,
        title: data.titre,
        author: data.nom,
        price: parseFloat((data.prix / 100).toFixed(2)),
        rating: 4.5,
        reviews: data.sales_count || 0,
        category: data.langue,
        isbn: data.code_bare,
        publication: data.date_publication
          ? new Date(data.date_publication).getFullYear()
          : 'N/A',
        pages: data.nombre_pages,
        language: data.langue,
        stock: data.quantites,
        in_stock: data.in_stock,
        description: data.description,
        publisher: data.editeur,
        images: data.images?.map((img) => img.image_url) || [],
        dimensions: `${data.largeur_cm} × ${data.hauteur_cm} × ${data.epaisseur_cm} cm`,
        weight: data.poids_grammes ? `${(data.poids_grammes / 1000).toFixed(2)} kg` : 'N/A',
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors du chargement du livre'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Livre non trouvé</h2>
        <p className="text-gray-600 mb-6">
          {error || 'Ce livre n\'existe pas ou a été supprimé.'}
        </p>
        <button
          onClick={() => navigate('/admin/books')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
        >
          Retour aux livres
        </button>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-xl text-gray-600 mt-2">par {book.author}</p>
        </div>
        <button
          onClick={() => navigate('/admin/books')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
        >
          ← Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Book Image Gallery */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Main Image */}
            {book.images.length > 0 ? (
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src={book.images[currentImageIndex]}
                  alt={`${book.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {book.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {book.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {book.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {book.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Price and Stock */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-5xl font-bold text-primary mb-4">{book.price}€</p>
            <p
              className={`text-lg font-semibold ${
                book.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {book.stock > 0 ? `${book.stock} exemplaires disponibles` : 'Rupture de stock'}
            </p>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Book Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Informations</h2>
            <div className="grid grid-cols-2 gap-6">
              {book.isbn && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">ISBN</p>
                  <p className="font-semibold text-gray-900 font-mono text-sm">{book.isbn}</p>
                </div>
              )}
              {book.publisher && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Éditeur</p>
                  <p className="font-semibold text-gray-900">{book.publisher}</p>
                </div>
              )}
              {book.publication && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Publication</p>
                  <p className="font-semibold text-gray-900">{book.publication}</p>
                </div>
              )}
              {book.pages && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pages</p>
                  <p className="font-semibold text-gray-900">{book.pages}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Langue</p>
                  <p className="font-semibold text-gray-900">{book.language}</p>
                </div>
              )}
              {book.dimensions && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dimensions</p>
                  <p className="font-semibold text-gray-900">{book.dimensions}</p>
                </div>
              )}
              {book.weight && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Poids</p>
                  <p className="font-semibold text-gray-900">{book.weight}</p>
                </div>
              )}
              {book.category && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                  <p className="font-semibold text-gray-900">{book.category}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/admin/books/${book.id}/edit`)}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Modifier le livre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
