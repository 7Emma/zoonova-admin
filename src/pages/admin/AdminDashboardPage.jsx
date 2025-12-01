import React, { useState, useEffect } from 'react';
import ordersService from '../../services/ordersService';
import contactService from '../../services/contactService';

export default function AdminDashboardPage() {
  const [ordersStats, setOrdersStats] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orders, contacts] = await Promise.all([
        ordersService.getStatistics(),
        contactService.getStatistics(),
      ]);

      setOrdersStats(orders);
      setContactStats(contacts);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  const stats = [
    {
      label: 'Chiffre d\'affaires',
      value: `€${ordersStats?.total_revenue?.toFixed(2) || '0'}`,
      subtext: `Mensuel: €${ordersStats?.monthly_revenue?.toFixed(2) || '0'}`,
    },
    {
      label: 'Commandes totales',
      value: ordersStats?.total_orders || '0',
      subtext: `Mensuel: ${ordersStats?.monthly_orders || '0'} commandes`,
    },
    {
      label: 'Messages de contact',
      value: contactStats?.total_messages || '0',
      subtext: `Non lus: ${contactStats?.unread_messages || '0'}`,
    },
    {
      label: 'Messages en attente',
      value: contactStats?.pending_messages || '0',
      subtext: `Répondus: ${contactStats?.replied_messages || '0'}`,
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard Admin</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Orders by Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Commandes par statut</h2>
          {ordersStats?.orders_by_status && ordersStats.orders_by_status.length > 0 ? (
            <div className="space-y-3">
              {ordersStats.orders_by_status.map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold capitalize">{item.status}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / ordersStats.total_orders) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-gray-900 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
          )}
        </div>

        {/* Messages by Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Messages de contact</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-900 font-semibold">Lus</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        contactStats?.total_messages
                          ? ((contactStats.total_messages - contactStats.unread_messages) /
                              contactStats.total_messages) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-gray-900 font-semibold">
                {contactStats?.total_messages ? contactStats.total_messages - contactStats.unread_messages : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-900 font-semibold">Non lus</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        contactStats?.total_messages
                          ? (contactStats.unread_messages / contactStats.total_messages) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-gray-900 font-semibold">{contactStats?.unread_messages || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-900 font-semibold">Répondus</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        contactStats?.total_messages
                          ? (contactStats.replied_messages / contactStats.total_messages) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-gray-900 font-semibold">{contactStats?.replied_messages || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Actions rapides</h2>
          <div className="space-y-2">
            <a href="/admin/orders" className="block px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              Voir toutes les commandes
            </a>
            <a href="/admin/payments" className="block px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition">
              Voir les paiements
            </a>
            <a href="/admin/messages" className="block px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              Voir les messages
            </a>
            <a href="/admin/books" className="block px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-semibold transition">
              Gérer les livres
            </a>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Résumé du jour</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Commandes du jour</span>
              <span className="font-semibold text-gray-900">{ordersStats?.monthly_orders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Revenus du jour</span>
              <span className="font-semibold text-gray-900">€{ordersStats?.monthly_revenue?.toFixed(2) || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span>Nouveaux messages</span>
              <span className="font-semibold text-gray-900">{contactStats?.unread_messages || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
