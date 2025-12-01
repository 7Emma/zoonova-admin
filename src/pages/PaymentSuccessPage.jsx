import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../contexts/CartContext';
import { paymentsService, ordersService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderInfo = async () => {
      try {
        // Récupère l'order_id ou session_id depuis les paramètres
        let orderId = searchParams.get('order_id');
        const sessionId = searchParams.get('session_id');
        
        // Si on a un session_id, il peut contenir l'order_id
        if (sessionId && !orderId) {
          orderId = sessionId;
        }
        
        if (!orderId) {
          setError('Pas de commande trouvée');
          setLoading(false);
          return;
        }

        // Vérifie le paiement et récupère les infos de la commande
        const paymentInfo = await paymentsService.verifyPayment(orderId);
        
        if (paymentInfo.order) {
          setOrder(paymentInfo.order);
          // Vide le panier une fois que la commande est confirmée
          clearCart();
        } else {
          setError('Commande non trouvée');
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError('Erreur lors du chargement des informations');
      } finally {
        setLoading(false);
      }
    };

    loadOrderInfo();
  }, [searchParams]);

  const handleDownloadInvoice = async () => {
    if (!order) return;

    try {
      const blob = await ordersService.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erreur lors du téléchargement de la facture:', err);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (error || !order) {
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
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-gray-900">Erreur</h1>
          <p className="text-gray-600 mb-8">{error || 'Une erreur est survenue'}</p>

          <Link
            to="/books"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto text-center py-16">
        <div className="mb-6">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900">Paiement confirmé</h1>
        <p className="text-gray-600 mb-2">Merci pour votre achat!</p>
        <p className="text-gray-600 mb-8">
          Un email de confirmation a été envoyé à {order.email}.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
          <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
          <p className="text-2xl font-bold text-primary mb-4">#{order.id}</p>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3">Adresse de livraison</p>
            <p className="text-sm text-gray-900">{order.full_address}</p>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm text-gray-600 mb-3">Prochaines étapes:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Traitement de votre commande</li>
              <li>✓ Préparation de l'expédition</li>
              <li>✓ Livraison à votre domicile</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadInvoice}
            className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            Télécharger la facture
          </button>

          <Link
            to="/books"
            className="block w-full text-primary hover:text-secondary font-semibold transition"
          >
            Continuer le shopping
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
