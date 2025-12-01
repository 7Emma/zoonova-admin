import React, { useState, useEffect } from 'react';
import { ordersService } from '../../services';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import Pagination from '../Pagination';
import OrderStatusModal from './OrderStatusModal';
import OrderDetailModal from './OrderDetailModal';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const options = {
        page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ordering: '-created_at',
      };

      const response = await ordersService.getOrders(options);
      setOrders(response.results || []);
      setTotalPages(Math.ceil(response.count / 20) || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setAlert({
        type: 'error',
        message: 'Erreur lors du chargement des commandes',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleViewDetails = async (order) => {
    try {
      const fullOrder = await ordersService.getOrder(order.id);
      setSelectedOrder(fullOrder);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      setAlert({
        type: 'error',
        message: 'Erreur lors de la récupération des détails',
      });
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusUpdated = () => {
    setShowStatusModal(false);
    loadOrders(currentPage);
    setAlert({
      type: 'success',
      message: 'Statut de la commande mis à jour avec succès',
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }

    try {
      await ordersService.deleteOrder(orderId);
      setAlert({
        type: 'success',
        message: 'Commande supprimée avec succès',
      });
      loadOrders(currentPage);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setAlert({
        type: 'error',
        message: 'Erreur lors de la suppression de la commande',
      });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const blob = await ordersService.downloadInvoice(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      setAlert({
        type: 'error',
        message: 'Erreur lors du téléchargement de la facture',
      });
    }
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

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Rechercher</label>
          <input
            type="text"
            placeholder="Email, nom, suivi..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Statut</label>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="delivered">Livrée</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{order.full_name}</p>
                      <p className="text-xs text-gray-600">{order.country_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}€
                  </td>
                  <td className="px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-semibold"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order)}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 font-semibold"
                    >
                      Statut
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-semibold"
                    >
                      Facture
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 font-semibold"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => loadOrders(page)}
          />
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showStatusModal && selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onStatusUpdated={handleStatusUpdated}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}
