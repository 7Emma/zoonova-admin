import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant de carte livre pour affichage public
 * Affiche un livre en format carte avec image et infos basiques
 */
export default function BookCard({ book, onClick }) {
  // Format du prix en euros
  const priceEuros = (book.prix / 100).toFixed(2);

  return (
    <Link
      to={`/books/${book.id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition hover:border-primary"
      onClick={onClick}
    >
      {/* Image du livre */}
      <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden">
        {book.main_image ? (
          <img
            src={book.main_image}
            alt={book.titre}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-sm">Pas d'image</span>
          </div>
        )}

        {/* Badge "En avant" */}
        {book.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            En avant
          </div>
        )}

        {/* Badge "Rupture de stock" */}
        {!book.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Infos du livre */}
      <div className="p-4 flex flex-col h-full">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
          {book.titre}
        </h3>

        <p className="text-gray-600 text-xs mb-2">{book.nom}</p>

        <p className="text-gray-500 text-xs line-clamp-2 mb-auto">
          {book.legende}
        </p>

        {/* Prix et bouton */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="font-bold text-lg text-primary">
            {priceEuros}€
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              book.in_stock
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {book.in_stock ? 'En stock' : 'Indisponible'}
          </span>
        </div>
      </div>
    </Link>
  );
}
