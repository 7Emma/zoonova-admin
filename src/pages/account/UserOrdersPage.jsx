import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

export default function UserOrdersPage() {
  const orders = [
    {
      id: 1001,
      date: '2024-01-15',
      total: 45.99,
      status: 'delivered',
      items: 3,
    },
    {
      id: 1002,
      date: '2024-01-10',
      total: 89.50,
      status: 'delivered',
      items: 5,
    },
    {
      id: 1003,
      date: '2024-01-05',
      total: 25.00,
      status: 'delivered',
      items: 2,
    },
  ];

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En traitement' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Expédié' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Livré' },
    };
    const s = statuses[status];
    return <span className={`${s.bg} ${s.text} px-3 py-1 rounded text-sm font-semibold`}>{s.label}</span>;
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Mes commandes</h1>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">N° Commande</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">Date</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900">Articles</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-900">Total</th>
              <th className="text-center px-6 py-4 font-semibold text-gray-900">Statut</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                <td className="text-center px-6 py-4 text-gray-900">{order.items}</td>
                <td className="text-right px-6 py-4 font-semibold text-gray-900">{order.total}€</td>
                <td className="text-center px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="text-right px-6 py-4 space-x-3">
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="text-primary hover:text-secondary font-semibold"
                  >
                    Détails
                  </Link>
                  <a
                    href="#"
                    className="text-primary hover:text-secondary font-semibold"
                  >
                    Facture
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore de commandes.</p>
          <Link
            to="/books"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
          >
            Explorer le catalogue
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
