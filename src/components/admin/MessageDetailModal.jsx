import React, { useState } from 'react';

export default function MessageDetailModal({
  message,
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAsReplied,
  onDelete,
}) {
  const [adminNotes, setAdminNotes] = useState(message.admin_notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkAsReplied = async () => {
    setIsSubmitting(true);
    try {
      await onMarkAsReplied(adminNotes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Détails du message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sender Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">EXPÉDITEUR</h3>
            <p className="text-gray-900 font-semibold">{message.full_name}</p>
            <a
              href={`mailto:${message.email}`}
              className="text-primary hover:text-secondary text-sm"
            >
              {message.email}
            </a>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">SUJET</h3>
            <p className="text-gray-900">{message.subject || 'N/A'}</p>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">MESSAGE</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          {/* Message Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">STATUT DE LECTURE</h3>
              <p className={`text-sm font-semibold ${message.is_read ? 'text-green-600' : 'text-red-600'}`}>
                {message.is_read ? '✓ Lu' : 'Non lu'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">RÉPONSE ENVOYÉE</h3>
              <p className={`text-sm font-semibold ${message.replied_at ? 'text-green-600' : 'text-yellow-600'}`}>
                {message.replied_at
                  ? `✓ ${new Date(message.replied_at).toLocaleDateString('fr-FR')}`
                  : 'En attente'}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div>
              <p className="text-xs text-gray-600">Reçu le</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(message.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Dernière modification</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(message.updated_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">NOTES INTERNES</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ajouter des notes internes (optionnel)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ces notes sont visibles uniquement par les administrateurs
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-wrap gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Fermer
          </button>

          {!message.is_read && (
            <button
              onClick={onMarkAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Marquer comme lu
            </button>
          )}

          {message.is_read && !message.replied_at && (
            <button
              onClick={onMarkAsUnread}
              className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Marquer comme non lu
            </button>
          )}

          {!message.replied_at && (
            <button
              onClick={handleMarkAsReplied}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Enregistrement...' : 'Marquer comme répondu'}
            </button>
          )}

          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
