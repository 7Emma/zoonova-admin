import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import MessageDetailModal from '../../components/admin/MessageDetailModal';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch messages and statistics
  useEffect(() => {
    fetchMessages();
    fetchStatistics();
  }, [searchTerm, filterStatus, currentPage]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
      };

      // Add search filter
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add status filter
      if (filterStatus === 'unread') {
        params.unread_only = true;
      } else if (filterStatus === 'read') {
        params.is_read = true;
      } else if (filterStatus === 'replied') {
        params.is_read = true;
        // Note: replied filtering should be done on client side since API doesn't have a specific filter
      }

      const response = await contactService.getMessages(params);
      
      // Filter replied messages if needed
      let filteredMessages = response.results;
      if (filterStatus === 'replied') {
        filteredMessages = filteredMessages.filter(m => m.replied_at !== null);
      }

      setMessages(filteredMessages);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des messages');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await contactService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
    }
  };

  const handleViewMessage = async (message) => {
    try {
      const fullMessage = await contactService.getMessage(message.id);
      setSelectedMessage(fullMessage);
      setShowDetailModal(true);
    } catch (err) {
      setError('Erreur lors de la récupération du message');
      console.error('Erreur:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      fetchMessages();
      fetchStatistics();
    } catch (err) {
      setError('Erreur lors de la mise à jour du message');
      console.error('Erreur:', err);
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await contactService.markAsUnread(id);
      fetchMessages();
      fetchStatistics();
    } catch (err) {
      setError('Erreur lors de la mise à jour du message');
      console.error('Erreur:', err);
    }
  };

  const handleMarkAsReplied = async (id, adminNotes = '') => {
    try {
      await contactService.markAsReplied(id, { admin_notes: adminNotes });
      fetchMessages();
      fetchStatistics();
      setShowDetailModal(false);
    } catch (err) {
      setError('Erreur lors de la mise à jour du message');
      console.error('Erreur:', err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
      try {
        await contactService.deleteMessage(id);
        fetchMessages();
        fetchStatistics();
      } catch (err) {
        setError('Erreur lors de la suppression du message');
        console.error('Erreur:', err);
      }
    }
  };

  const handleBulkMarkAsRead = async () => {
    const unreadMessages = messages.filter(m => !m.is_read).map(m => m.id);
    if (unreadMessages.length === 0) {
      alert('Aucun message non lu');
      return;
    }
    try {
      await contactService.bulkMarkAsRead(unreadMessages);
      fetchMessages();
      fetchStatistics();
    } catch (err) {
      setError('Erreur lors de la mise à jour des messages');
      console.error('Erreur:', err);
    }
  };

  const getStatusBadge = (message) => {
     if (!message.is_read) {
       return <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">Non lu</span>;
     }
     if (message.replied_at) {
       return <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">Répondu</span>;
     }
     return <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">Lu</span>;
   };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Messages de contact</h1>
          {unreadCount > 0 && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleBulkMarkAsRead}
            className="bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary transition text-sm sm:text-base whitespace-nowrap"
          >
            Marquer tous comme lus
          </button>
        )}
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-600 font-semibold">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-900">{statistics.total_messages}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-red-600 font-semibold">Non lus</p>
            <p className="text-xl sm:text-2xl font-bold text-red-900">{statistics.unread_messages}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-green-600 font-semibold">Répondus</p>
            <p className="text-xl sm:text-2xl font-bold text-green-900">{statistics.replied_messages}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-yellow-600 font-semibold">En attente</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-900">{statistics.pending_messages}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Rechercher par email, nom, sujet..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="unread">Non lu</option>
            <option value="read">Lu</option>
            <option value="replied">Répondu</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Chargement des messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-600">Aucun message trouvé</div>
        ) : (
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Expéditeur</th>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Sujet</th>
                <th className="text-left px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Message</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm hidden md:table-cell">Date</th>
                <th className="text-center px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Statut</th>
                <th className="text-center sm:text-right px-2 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-2 sm:px-6 py-3 sm:py-4">
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">{message.full_name}</p>
                    <p className="text-xs text-gray-600 hidden sm:block truncate">{message.email}</p>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold text-xs sm:text-sm hidden sm:table-cell truncate">{message.subject || 'N/A'}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 text-gray-600 text-xs sm:text-sm max-w-xs truncate">{message.message}</td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                    {new Date(message.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="text-center px-2 sm:px-6 py-3 sm:py-4">{getStatusBadge(message)}</td>
                  <td className="text-center sm:text-right px-2 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="text-primary hover:text-secondary font-semibold text-xs sm:text-sm transition"
                    >
                      Voir
                    </button>
                    {!message.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm transition"
                        title="Marquer comme lu"
                      >
                        Lu
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message Detail Modal */}
      {showDetailModal && selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setShowDetailModal(false)}
          onMarkAsRead={() => handleMarkAsRead(selectedMessage.id)}
          onMarkAsUnread={() => handleMarkAsUnread(selectedMessage.id)}
          onMarkAsReplied={(notes) => handleMarkAsReplied(selectedMessage.id, notes)}
          onDelete={() => {
            handleDeleteMessage(selectedMessage.id);
            setShowDetailModal(false);
          }}
        />
      )}
    </>
  );
}
