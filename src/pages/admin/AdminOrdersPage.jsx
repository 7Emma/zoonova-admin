import React, { useState, useEffect } from 'react';
import OrdersService from '../../services/ordersService';

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: 'paid', // Par défaut, afficher seulement les commandes payées
    date: '',
    page: 1
  });

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  useEffect(() => {
    fetchOrders();
  }, [filters.page, filters.status, filters.payment_status, filters.date]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const options = {
        page: filters.page,
        ordering: '-created_at'
      };

      if (filters.status) options.status = filters.status;
      if (filters.payment_status) options.payment_status = filters.payment_status;
      if (filters.date) options.start_date = filters.date;
      if (filters.search) options.search = filters.search;

      const response = await OrdersService.getOrders(options);
      
      setOrders(response.results || []);
      setPagination({
        count: response.count || 0,
        next: response.next,
        previous: response.previous
      });
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'all' ? '' : value,
      page: 1 
    }));
  };

  const handleDateChange = (e) => {
    setFilters(prev => ({ ...prev, date: e.target.value, page: 1 }));
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await OrdersService.getOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      alert('Impossible de charger les détails de la commande');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      const statusData = {
        status: newStatus,
        tracking_number: trackingNumber
      };

      await OrdersService.updateOrderStatus(orderId, statusData);
      
      await fetchOrders();
      
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = await OrdersService.getOrder(orderId);
        setSelectedOrder(updated);
      }

      alert('Statut mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const blob = await OrdersService.downloadInvoice(orderId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En traitement' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Expédié' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Livré' },
    };
    const s = statuses[status] || statuses.pending;
    return <span className={`${s.bg} ${s.text} px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold`}>{s.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-gray-900">Gestion des commandes</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8">
         <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
           <input
             type="text"
             placeholder="Rechercher un client..."
             value={filters.search}
             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <select 
             value={filters.status || 'all'}
             onChange={handleStatusChange}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="all">Tous les statuts</option>
             <option value="pending">En attente</option>
             <option value="processing">En traitement</option>
             <option value="shipped">Expédié</option>
             <option value="delivered">Livré</option>
           </select>
           <select 
             value={filters.payment_status}
             onChange={(e) => setFilters(prev => ({ ...prev, payment_status: e.target.value, page: 1 }))}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="">Tous les paiements</option>
             <option value="paid">Payée</option>
             <option value="unpaid">Non payée</option>
           </select>
           <input
             type="date"
             value={filters.date}
             onChange={handleDateChange}
             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>
        <button
          onClick={handleSearch}
          className="mt-4 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Rechercher
        </button>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6 overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                   <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">N° Commande</th>
                   <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Client</th>
                   <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Adresse</th>
                   <th className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Sous-total</th>
                   <th className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Frais</th>
                   <th className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Total</th>
                   <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Statut</th>
                   <th className="text-center sm:text-right px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">#{order.id}</td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <div className="text-gray-900 font-medium text-xs sm:text-sm">{order.full_name}</div>
                        <div className="text-xs text-gray-600 hidden sm:block">{order.email}</div>
                       </td>
                       <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-sm truncate">{order.full_address || 'N/A'}</td>
                        <td className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">{order.subtotal_euros || '0'}€</td>
                        <td className="text-right px-2 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">{order.shipping_cost_euros || '0'}€</td>
                        <td className="text-right px-2 sm:px-6 py-3 sm:py-4 font-bold text-blue-600 text-xs sm:text-sm">{order.total_euros}€</td>
                      <td className="text-center px-2 sm:px-6 py-3 sm:py-4">{getStatusBadge(order.status)}</td>
                      <td className="text-center sm:text-right px-2 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Détails
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.count > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="text-gray-600 text-sm sm:text-base">
                Total: {pagination.count} commande{pagination.count > 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.previous}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Précédent
                </button>
                <span className="px-3 sm:px-4 py-2 text-gray-700 text-sm sm:text-base">
                  Page {filters.page}
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.next}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6 flex justify-between items-start sm:items-center sticky top-0 gap-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Commande #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Client</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.full_name}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Adresse de livraison</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.full_address}</p>
                <p className="text-gray-600 mt-2 text-sm">Pays: {selectedOrder.country_name}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Articles commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.book_title}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Quantité: {item.quantity}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Prix unitaire: {item.unit_price_euros}€</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.subtotal_euros}€</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Sous-total</span>
                    <span className="text-gray-900 text-sm sm:text-base">{selectedOrder.subtotal_euros}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Frais de port</span>
                    <span className="text-gray-900 text-sm sm:text-base">{selectedOrder.shipping_cost_euros}€</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Total</span>
                    <span className="font-bold text-blue-600 text-base sm:text-lg">{selectedOrder.total_euros}€</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Statut</p>
                <div className="mb-4">{getStatusBadge(selectedOrder.status)}</div>
                
                {selectedOrder.tracking_number && (
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm text-gray-500">Numéro de suivi</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{selectedOrder.tracking_number}</p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm text-gray-500">Notes</p>
                    <p className="text-gray-900 text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.delivered_at && (
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm text-gray-500">Date de livraison</p>
                    <p className="text-gray-900 text-sm sm:text-base">{formatDate(selectedOrder.delivered_at)}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-3">Actions rapides</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedOrder.status !== 'delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
                    >
                      Marquer comme livré
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder.id)}
                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    Télécharger facture
                  </button>
                </div>
              </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Fermer
              </button>
              </div>
          </div>
        </div>
      )}
    </>
  );
}