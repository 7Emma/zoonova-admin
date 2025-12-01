import React from 'react';

export default function OrderDetailModal({ order, onClose }) {
  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Livrée' },
    };
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Commande #{order.id}</h2>
            <p className="text-gray-600">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Client</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Nom:</span> {order.full_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-semibold">Téléphone:</span> {order.phone || 'N/A'}
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Livraison</h3>
            <div className="space-y-2 text-sm">
              <p>{order.full_address}</p>
              <p>
                <span className="font-semibold">Pays:</span> {order.country_name}
              </p>
              {order.tracking_number && (
                <p>
                  <span className="font-semibold">Suivi:</span> {order.tracking_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status and Dates */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Statut</h3>
          <div className="space-y-2 text-sm">
            <p>{getStatusBadge(order.status)}</p>
            {order.delivered_at && (
              <p>
                <span className="font-semibold">Livré le:</span>{' '}
                {new Date(order.delivered_at).toLocaleString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Livre</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-900">Prix U.</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-900">Quantité</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="px-4 py-2 text-gray-900">{item.book_title}</td>
                    <td className="px-4 py-2 text-right text-gray-900">
                      {formatPrice(item.unit_price)}€
                    </td>
                    <td className="px-4 py-2 text-right text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="text-gray-900 font-semibold">{formatPrice(order.subtotal)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className="text-gray-900 font-semibold">
                {formatPrice(order.shipping_cost)}€
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-lg text-primary">{formatPrice(order.total)}€</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
