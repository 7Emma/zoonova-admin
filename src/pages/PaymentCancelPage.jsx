import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function PaymentCancelPage() {
  return (
    <MainLayout>
      <div className="max-w-md mx-auto text-center py-16">
        <div className="mb-6">
          <div className="inline-block bg-red-100 rounded-full p-4 mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900">Paiement annulé</h1>
        <p className="text-gray-600 mb-8">
          Votre paiement a été annulé. Votre panier a été conservé.
        </p>

        <div className="space-y-3">
          <Link
            to="/cart"
            className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Retour au panier
          </Link>

          <Link
            to="/books"
            className="block w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            Continuer le shopping
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
