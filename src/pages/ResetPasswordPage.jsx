import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';

/**
 * Page de réinitialisation du mot de passe
 * Supporte le format d'URL: /reset-password/:token
 */
export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  if (!token) {
    return (
      <MainLayout hideNavbar>
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              Lien de réinitialisation invalide ou expiré
            </div>
            <Link
              to="/password-reset/request"
              className="text-primary hover:text-secondary font-semibold transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideNavbar>
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Nouveau mot de passe
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Entrez votre nouveau mot de passe
          </p>

          <ResetPasswordForm
            token={token}
            onSuccess={() => {
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            }}
          />

          <div className="mt-6 text-center">
            <Link
              to="/password-reset/request"
              className="text-sm text-primary hover:text-secondary font-semibold transition"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
