import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto text-center py-20">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-block bg-primary bg-opacity-10 rounded-full p-8 mb-6">
            <svg
              className="w-24 h-24 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h2>
        <p className="text-lg text-gray-600 mb-8">
          Désolé, la page que vous cherchez n'existe pas ou a été supprimée.
        </p>

        {/* Suggested Actions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voici ce que vous pouvez faire:</h3>
          <ul className="text-gray-600 space-y-2 text-left max-w-sm mx-auto">
            <li className="flex items-start">
              <span className="text-primary mr-3">✓</span>
              <span>Retourner à l'accueil</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3">✓</span>
              <span>Vérifier l'URL que vous avez saisie</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3">✓</span>
              <span>Utiliser la recherche pour trouver ce que vous cherchez</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-3">✓</span>
              <span>Nous contacter si vous avez besoin d'aide</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/books"
            className="inline-block border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            Voir le catalogue
          </Link>
          <Link
            to="/contact"
            className="inline-block bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Nous contacter
          </Link>
        </div>

        {/* Error Code */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Code d'erreur: 404 | Page non trouvée
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
