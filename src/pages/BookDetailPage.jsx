import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { booksService, ApiError } from '../services';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger le livre à l'affichage
  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await booksService.getBookById(parseInt(id));

      // Adapter la réponse API
      setBook({
        id: data.id,
        title: data.titre,
        author: data.nom,
        price: parseFloat((data.prix / 100).toFixed(2)),
        rating: 4.5, // À adapter selon votre API
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
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (error || !book) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Livre non trouvé</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Ce livre n\'existe pas ou a été supprimé.'}
          </p>
          <button
            onClick={() => navigate('/books')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
          >
            Retour aux livres
          </button>
        </div>
      </MainLayout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    navigate('/cart');
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Book Image Gallery */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {/* Main Image */}
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center relative overflow-hidden mb-4">
              <img
                src={book.images[currentImageIndex]}
                alt={`${book.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Previous Button */}
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

              {/* Next Button */}
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

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {book.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
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
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">par {book.author}</p>

          {/* Price and Stock */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-5xl font-bold text-primary mb-4">{book.price}€</p>
            <p
              className={`text-lg font-semibold mb-4 ${
                book.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {book.stock > 0 ? `${book.stock} exemplaires disponibles` : 'Rupture de stock'}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <label className="block text-sm font-semibold text-gray-900 mr-4">
                Quantité:
              </label>
              <input
                type="number"
                min="1"
                max={book.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          {/* Book Information */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-8">
            {book.isbn && (
              <div>
                <p className="text-sm text-gray-600">ISBN</p>
                <p className="font-semibold text-gray-900 font-mono text-sm">{book.isbn}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Éditeur</p>
              <p className="font-semibold text-gray-900">{book.publisher}</p>
            </div>
            {book.publication && (
              <div>
                <p className="text-sm text-gray-600">Publication</p>
                <p className="font-semibold text-gray-900">{book.publication}</p>
              </div>
            )}
            {book.pages && (
              <div>
                <p className="text-sm text-gray-600">Pages</p>
                <p className="font-semibold text-gray-900">{book.pages}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Langue</p>
              <p className="font-semibold text-gray-900">{book.language}</p>
            </div>
            {book.dimensions && (
              <div>
                <p className="text-sm text-gray-600">Dimensions</p>
                <p className="font-semibold text-gray-900">{book.dimensions}</p>
              </div>
            )}
            {book.weight && (
              <div>
                <p className="text-sm text-gray-600">Poids</p>
                <p className="font-semibold text-gray-900">{book.weight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
