import React, { useState } from 'react';

/**
 * Composant de filtrage pour la liste des livres
 * Permet de filtrer par prix, langue, éditeur, etc.
 */
export default function BookFilters({ onFilterChange, isLoading }) {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    langue: '',
    editeur: '',
    inStock: false,
    isFeatured: false,
    ordering: '-created_at',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedFilters = {
      ...filters,
      [name]: newValue,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      langue: '',
      editeur: '',
      inStock: false,
      isFeatured: false,
      ordering: '-created_at',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <h3 className="font-bold text-lg text-gray-900">Filtres</h3>

      {/* Recherche */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Recherche
        </label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Titre, auteur, description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        />
      </div>

      {/* Tri */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Tri
        </label>
        <select
          name="ordering"
          value={filters.ordering}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        >
          <option value="-created_at">Plus récents</option>
          <option value="created_at">Plus anciens</option>
          <option value="prix">Prix: bas à haut</option>
          <option value="-prix">Prix: haut à bas</option>
          <option value="views_count">Moins vus</option>
          <option value="-views_count">Plus vus</option>
          <option value="sales_count">Moins vendus</option>
          <option value="-sales_count">Plus vendus</option>
        </select>
      </div>

      {/* Plage de prix */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">
          Plage de prix (€)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Langue */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Langue
        </label>
        <select
          name="langue"
          value={filters.langue}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        >
          <option value="">Toutes les langues</option>
          <option value="Français">Français</option>
          <option value="Anglais">Anglais</option>
          <option value="Espagnol">Espagnol</option>
          <option value="Allemand">Allemand</option>
          <option value="Italien">Italien</option>
        </select>
      </div>

      {/* Éditeur */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Éditeur
        </label>
        <input
          type="text"
          name="editeur"
          value={filters.editeur}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Nom de l'éditeur"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-gray-700">En stock seulement</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={filters.isFeatured}
            onChange={handleChange}
            disabled={isLoading}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-gray-700">En avant seulement</span>
        </label>
      </div>

      {/* Bouton réinitialiser */}
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition disabled:bg-gray-50 disabled:text-gray-400"
      >
        Réinitialiser
      </button>
    </div>
  );
}
