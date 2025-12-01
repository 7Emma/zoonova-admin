import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';

/**
 * Page de redirection pour Stripe
 * Reçoit les paramètres de Stripe et redirige vers les bonnes pages
 */
export default function PaymentRedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Récupère les paramètres de Stripe
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    // Si c'est un succès (order_id ou session_id présent)
    if (orderId) {
      navigate(`/payment-success?order_id=${orderId}`);
    } else if (sessionId) {
      navigate(`/payment-success?session_id=${sessionId}`);
    }
    // Si c'est un échec/annulation
    else {
      navigate('/payment-cancel');
    }
  }, [searchParams, navigate]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    </MainLayout>
  );
}
