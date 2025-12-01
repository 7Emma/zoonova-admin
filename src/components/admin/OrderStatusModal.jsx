import React, { useState } from 'react';
import { ordersService } from '../../services';

export default function OrderStatusModal({ order, onStatusUpdated, onClose }) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [notes, setNotes] = useState(order.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Valide que un numéro de suivi est fourni si le statut est "delivered"
    if (status === 'delivered' && !trackingNumber.trim()) {
      setError('Un numéro de suivi est requis pour marquer comme livrée');
      return;
    }

    try {
      setLoading(true);

      await ordersService.updateOrderStatus(order.id, {
        status,
        tracking_number: trackingNumber,
        notes,
      });

      onStatusUpdated();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      
      let errorMessage = 'Erreur lors de la mise à jour du statut';
      if (err.data?.status) {
        errorMessage = Array.isArray(err.data.status)
          ? err.data.status[0]
          : err.data.status;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Mettre à jour le statut</h2>

        <p className="text-gray-600 mb-4">Commande #{order.id} - {order.full_name}</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">En attente</option>
              <option value="delivered">Livrée</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Numéro de suivi
              {status === 'delivered' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ex: FR123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {status === 'delivered' && !trackingNumber && (
              <p className="text-red-500 text-sm mt-1">
                Obligatoire pour une livraison
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes internes ou pour le client"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
