import React from 'react';

/**
 * Composant de pagination pour les listes
 * Affiche les boutons précédent/suivant et numéros de page
 */
export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }) {
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Bouton précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isLoading || currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 font-semibold transition"
      >
        Précédent
      </button>

      {/* Ellipsis début */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 font-semibold"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Numéros de pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          className={`px-3 py-2 rounded-lg font-semibold transition ${
            currentPage === page
              ? 'bg-primary text-white border border-primary'
              : 'border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis fin */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 font-semibold"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Bouton suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLoading || currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 font-semibold transition"
      >
        Suivant
      </button>

      {/* Infos pagination */}
      <span className="ml-4 text-gray-600 text-sm font-semibold">
        Page {currentPage} sur {totalPages}
      </span>
    </div>
  );
}
