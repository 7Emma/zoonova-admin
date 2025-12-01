import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import OrdersList from '../../components/admin/OrdersList';
import OrderStatistics from '../../components/admin/OrderStatistics';

export default function OrdersManagementPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestion des commandes</h1>
          <p className="text-gray-600 mt-2">
            Consultez et gérez toutes les commandes des clients
          </p>
        </div>

        <OrderStatistics />

        <OrdersList />
      </div>
    </AdminLayout>
  );
}
