import React, { useState, useEffect } from 'react';
import { AdminProfile, ChangePasswordForm } from '../../components/auth';
import { authService } from '../../services';
import { AlertCircle, Loader, LogOut, Trash2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [invalidatingSession, setInvalidatingSession] = useState(null);
  const [invalidatingAll, setInvalidatingAll] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUserAgent] = useState(navigator.userAgent);

  // Charger les sessions quand l'onglet "Sessions" est sélectionné
  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    setError(null);
    try {
      const response = await authService.getSessions();
      setSessions(response.sessions || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleInvalidateSession = async (sessionId) => {
    setInvalidatingSession(sessionId);
    setError(null);
    setSuccess(null);
    try {
      await authService.invalidateSession(sessionId);
      setSuccess('Session invalidée avec succès');
      fetchSessions();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'invalidation de la session');
    } finally {
      setInvalidatingSession(null);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Êtes-vous sûr? Vous serez déconnecté de tous les appareils.')) {
      return;
    }

    setInvalidatingAll(true);
    setError(null);
    setSuccess(null);
    try {
      await authService.logoutAllDevices();
      setSuccess('Vous avez été déconnecté de tous les appareils');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la déconnexion');
      setInvalidatingAll(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrowserInfo = (userAgent) => {
    if (!userAgent) return 'Inconnu';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Autre';
  };

  const isCurrentSession = (sessionUserAgent) => {
    return sessionUserAgent === currentUserAgent;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Paramètres du Compte</h1>
        <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos préférences de sécurité</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 flex-wrap">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'profile'
              ? 'text-primary border-primary'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'security'
              ? 'text-primary border-primary'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'sessions'
              ? 'text-primary border-primary'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          }`}
        >
          Sessions
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && <AdminProfile />}
        {activeTab === 'security' && <ChangePasswordForm />}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-green-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Vos Sessions Actives</h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Gérez vos appareils connectés et invalidez les sessions non utilisées
                  </p>
                </div>
                <button
                  onClick={handleLogoutAllDevices}
                  disabled={invalidatingAll || loadingSessions}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium text-sm md:text-base"
                >
                  {invalidatingAll ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>Déconnecter tous</span>
                  <span className="hidden sm:inline">les appareils</span>
                </button>
              </div>

              {loadingSessions ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune session active</p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => {
                    const current = isCurrentSession(session.user_agent);
                    return (
                      <div
                        key={session.id}
                        className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 transition ${
                          current
                            ? 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="font-semibold text-gray-900 text-lg">
                              {getBrowserInfo(session.user_agent)}
                            </p>
                            {current && (
                              <span className="inline-block w-fit bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Votre session actuelle
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="break-all">
                              <span className="font-medium text-gray-700">IP:</span> {session.ip_address}
                            </p>
                            <p>
                              <span className="font-medium text-gray-700">Créée:</span>{' '}
                              {formatDate(session.created_at)}
                            </p>
                            <p>
                              <span className="font-medium text-gray-700">Expire:</span>{' '}
                              {formatDate(session.expires_at)}
                            </p>
                            {session.is_active && (
                              <p className="text-green-600 font-medium">
                                ✓ Active
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleInvalidateSession(session.id)}
                          disabled={invalidatingSession === session.id || loadingSessions || current}
                          title={current ? 'Impossible de fermer votre session actuelle' : ''}
                          className={`w-full md:w-auto md:ml-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                            current
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                              : 'text-white bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {invalidatingSession === session.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="md:hidden">
                            {current ? 'Session actuelle' : 'Invalider'}
                          </span>
                          <span className="hidden md:inline">
                            {current ? 'Session actuelle' : 'Invalider'}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
