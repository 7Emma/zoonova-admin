import React, { useState, useEffect } from 'react';
import paymentsService from '../../services/paymentsService';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  // Charge les paiements au montage et quand les filtres changent
  useEffect(() => {
    fetchPayments(currentPage);
  }, [filters, currentPage, pageSize]);

  const fetchPayments = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentsService.listPayments({
        page: page,
        page_size: pageSize,
      });
      
      setPayments(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      succeeded: { bg: 'bg-green-100', text: 'text-green-700', label: 'Réussi' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Échoué' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En traitement' },
      requires_payment_method: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Paiement requis' },
      canceled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Annulé' },
    };
    const s = statuses[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return <span className={`${s.bg} ${s.text} px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold`}>{s.label}</span>;
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
    setCurrentPage(1);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.order_email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      String(payment.order_id).includes(filters.search);
    const matchesStatus = !filters.status || payment.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-gray-900">Suivi des paiements Stripe</h1>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Rechercher un client ou une commande..."
            value={filters.search}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select 
            value={filters.status}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="succeeded">Réussi</option>
            <option value="failed">Échoué</option>
            <option value="processing">En traitement</option>
            <option value="requires_payment_method">Paiement requis</option>
            <option value="canceled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Chargement des paiements...</p>
        </div>
      )}

      {/* Payments Table */}
      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">ID Paiement</th>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Client</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Commande</th>
                <th className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Montant</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm hidden md:table-cell">Date</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm truncate">{payment.id}</td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell truncate">{payment.order_email}</td>
                    <td className="text-center px-2 sm:px-6 py-3 sm:py-4 text-gray-900 text-xs sm:text-sm">
                      <a href={`/admin/orders/${payment.order_id}`} className="text-primary hover:text-secondary font-semibold">
                        #{payment.order_id}
                      </a>
                    </td>
                    <td className="text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">{payment.amount_euros}€</td>
                    <td className="text-center px-2 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="text-center px-2 sm:px-6 py-3 sm:py-4">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-2 sm:px-6 py-8 text-center text-gray-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} sur {totalPages} ({totalCount} paiements au total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
