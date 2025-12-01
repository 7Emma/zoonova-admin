import React, { useState, useEffect } from 'react';
import { ApiError } from '../../services';

/**
 * Formulaire d'édition/création de livre pour l'admin
 * Peut être en mode création ou édition
 */
export default function BookForm({ book, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    titre: '',
    nom: '',
    description: '',
    legende: '',
    prix: '',
    code_bare: '',
    nombre_pages: '',
    largeur_cm: '',
    hauteur_cm: '',
    epaisseur_cm: '',
    poids_grammes: '',
    date_publication: '',
    editeur: '',
    langue: '',
    quantites: '',
    seo_title: '',
    seo_description: '',
    is_active: true,
    is_featured: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        titre: book.titre || '',
        nom: book.nom || '',
        description: book.description || '',
        legende: book.legende || '',
        prix: book.prix || '',
        code_bare: book.code_bare || '',
        nombre_pages: book.nombre_pages || '',
        largeur_cm: book.largeur_cm || '',
        hauteur_cm: book.hauteur_cm || '',
        epaisseur_cm: book.epaisseur_cm || '',
        poids_grammes: book.poids_grammes || '',
        date_publication: book.date_publication || '',
        editeur: book.editeur || '',
        langue: book.langue || '',
        quantites: book.quantites || '',
        seo_title: book.seo_title || '',
        seo_description: book.seo_description || '',
        is_active: book.is_active !== undefined ? book.is_active : true,
        is_featured: book.is_featured !== undefined ? book.is_featured : false,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Effacer l'erreur si l'utilisateur corrige
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation de base
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = 'Le titre est obligatoire';
    if (!formData.nom.trim()) newErrors.nom = "Le nom de l'auteur est obligatoire";
    if (!formData.prix) newErrors.prix = 'Le prix est obligatoire';
    if (!formData.quantites) newErrors.quantites = 'La quantité est obligatoire';
    if (!formData.editeur.trim()) newErrors.editeur = "L'éditeur est obligatoire";
    if (!formData.langue.trim()) newErrors.langue = 'La langue est obligatoire';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      if (err instanceof ApiError && err.data) {
        setErrors(err.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section Informations de base */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Informations de base</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Titre
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: Python pour les débutants"
            />
            {errors.titre && <p className="text-red-600 text-sm mt-1">{errors.titre}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Auteur
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: Jean Dupont"
            />
            {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Légende courte
            </label>
            <input
              type="text"
              name="legende"
              value={formData.legende}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: Apprenez la programmation facilement"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Éditeur
            </label>
            <input
              type="text"
              name="editeur"
              value={formData.editeur}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: Éditions Tech"
            />
            {errors.editeur && <p className="text-red-600 text-sm mt-1">{errors.editeur}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Langue
            </label>
            <select
              name="langue"
              value={formData.langue}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            >
              <option value="">Sélectionner une langue</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
              <option value="Espagnol">Espagnol</option>
              <option value="Allemand">Allemand</option>
              <option value="Italien">Italien</option>
            </select>
            {errors.langue && <p className="text-red-600 text-sm mt-1">{errors.langue}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Code-barre ISBN
            </label>
            <input
              type="text"
              name="code_bare"
              value={formData.code_bare}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: 9782123456789"
            />
          </div>
        </div>

        {/* Description longue */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            placeholder="Description complète du livre..."
          />
        </div>
      </div>

      {/* Section Détails physiques */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Détails physiques</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nombre de pages
            </label>
            <input
              type="number"
              name="nombre_pages"
              value={formData.nombre_pages}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Largeur (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="largeur_cm"
              value={formData.largeur_cm}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hauteur (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="hauteur_cm"
              value={formData.hauteur_cm}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Épaisseur (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="epaisseur_cm"
              value={formData.epaisseur_cm}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Poids (grammes)
            </label>
            <input
              type="number"
              name="poids_grammes"
              value={formData.poids_grammes}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date de publication
            </label>
            <input
              type="date"
              name="date_publication"
              value={formData.date_publication}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Section Commerce */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Commerce</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Prix (en €)
            </label>
            <input
              type="number"
              step="0.01"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Ex: 25.00"
            />
            {errors.prix && <p className="text-red-600 text-sm mt-1">{errors.prix}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantité en stock
            </label>
            <input
              type="number"
              name="quantites"
              value={formData.quantites}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
            {errors.quantites && <p className="text-red-600 text-sm mt-1">{errors.quantites}</p>}
          </div>
        </div>
      </div>

      {/* Section SEO */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">SEO</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Titre SEO
            </label>
            <input
              type="text"
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Titre pour les moteurs de recherche"
              maxLength="60"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seo_title.length}/60</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description SEO
            </label>
            <textarea
              name="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
              disabled={isLoading}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
              placeholder="Description pour les moteurs de recherche"
              maxLength="160"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.seo_description.length}/160</p>
          </div>
        </div>
      </div>

      {/* Section Statut */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Statut</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-gray-700">Actif (visible au public)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-gray-700">Mis en avant</span>
          </label>
        </div>
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
      >
        {isLoading ? 'Enregistrement...' : book ? 'Mettre à jour le livre' : 'Créer le livre'}
      </button>
    </form>
  );
}
