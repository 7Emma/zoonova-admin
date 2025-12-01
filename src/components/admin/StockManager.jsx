import React, { useState } from 'react';
import { booksService, ApiError } from '../../services';

/**
 * Composant de gestion du stock pour un livre
 * Permet de mettre à jour rapidement la quantité en stock
 */
export default function StockManager({ book, onUpdate }) {
  const [quantity, setQuantity] = useState(book?.quantites || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setQuantity(parseInt(e.target.value) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (quantity < 0) {
      setError('La quantité ne peut pas être négative');
      return;
    }

    setIsLoading(true);

    try {
      const response = await booksService.updateStock(book.id, quantity);
      setSuccess(response.message || 'Stock mis à jour');
      if (onUpdate) {
        onUpdate(response.book);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la mise à jour'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Gestion du stock</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Quantité disponible
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={quantity}
              onChange={handleChange}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={isLoading || quantity === book.quantites}
              className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </div>

        {/* Statut du stock */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Statut</p>
              <p className={`font-bold text-lg ${book?.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                {book?.in_stock ? 'En stock' : 'Rupture'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Unités disponibles</p>
              <p className="font-bold text-lg text-gray-900">{book?.quantites || 0}</p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setQuantity(quantity + 10)}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:bg-gray-50 text-sm font-semibold"
          >
            +10
          </button>
          <button
            type="button"
            onClick={() => setQuantity(Math.max(0, quantity - 10))}
            disabled={isLoading}
            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:bg-gray-50 text-sm font-semibold"
          >
            -10
          </button>
        </div>
      </form>
    </div>
  );
}
