import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import BookVideosManager from '../../components/admin/BookVideosManager';
import { booksService, ApiError } from '../../services';
import { Trash2, Plus, X } from 'lucide-react';

export default function AdminBookEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [formData, setFormData] = useState({
        titre: '',
        nom: '',
        description: '',
        prix: 0,
        quantites: 0,
        langue: 'Français',
        code_bare: '',
        date_publication: '',
        nombre_pages: 0,
        largeur_cm: '',
        hauteur_cm: '',
        epaisseur_cm: '',
        poids_grammes: '',
        editeur: '',
        seo_title: '',
        seo_description: '',
        is_active: true,
        is_featured: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [error, setError] = useState('');
    const [bookCreatedId, setBookCreatedId] = useState(id || null); // ID du livre créé/édité

    // Images et vidéos
    const [images, setImages] = useState([]);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imageFormData, setImageFormData] = useState({
        type: 'cover_front',
        alt_text: '',
        is_main_cover: false,
    });
    const [isAddingImage, setIsAddingImage] = useState(false);
    
    // Modal de confirmation de suppression
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        type: null, // 'image' ou 'video'
        id: null,
    });

    const langues = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];

    const imageTypes = [
        { value: 'cover_front', label: 'Couverture (1ère page)' },
        { value: 'cover_back', label: 'Couverture (4e page)' },
        { value: 'content', label: 'Contenu' },
        { value: 'other', label: 'Autre' },
    ];

    // Charger le livre à éditer
    useEffect(() => {
        if (!isNew) {
            fetchBook();
        }
    }, [id]);

    // Charger les images quand l'ID du livre est disponible
    useEffect(() => {
        if (bookCreatedId) {
            fetchImages();
        }
    }, [bookCreatedId]);

    const fetchImages = async () => {
        try {
            const data = await booksService.getBookImages(parseInt(bookCreatedId));
            setImages(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Erreur lors du chargement des images:', err);
        }
    };

    const fetchBook = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await booksService.getBookById(parseInt(id));

            // Adapter la réponse API au formulaire
            setFormData({
                titre: data.titre,
                nom: data.nom,
                description: data.description,
                prix: parseFloat((data.prix / 100).toFixed(2)),
                quantites: data.quantites,
                langue: data.langue,
                code_bare: data.code_bare,
                date_publication: data.date_publication,
                nombre_pages: data.nombre_pages,
                largeur_cm: data.largeur_cm,
                hauteur_cm: data.hauteur_cm,
                epaisseur_cm: data.epaisseur_cm,
                poids_grammes: data.poids_grammes,
                editeur: data.editeur,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                is_active: data.is_active,
                is_featured: data.is_featured,
            });
        } catch (err) {
            setError(
                err instanceof ApiError ? err.message : 'Erreur lors du chargement du livre'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
        if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'auteur est requis';
        if (formData.prix <= 0) newErrors.prix = 'Le prix doit être supérieur à 0';
        if (formData.quantites < 0) newErrors.quantites = 'La quantité ne peut pas être négative';
        if (!formData.editeur.trim()) newErrors.editeur = 'L\'éditeur est requis';
        if (!formData.langue) newErrors.langue = 'La langue est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddImage = async () => {
        if (!selectedImageFile) {
            setError('Veuillez sélectionner une image');
            return;
        }

        setIsAddingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedImageFile);
            formData.append('type', imageFormData.type);
            formData.append('alt_text', imageFormData.alt_text);
            formData.append('is_main_cover', imageFormData.is_main_cover);

            await booksService.addBookImage(parseInt(bookCreatedId), formData);
            setSelectedImageFile(null);
            setImageFormData({
                type: 'cover_front',
                alt_text: '',
                is_main_cover: false,
            });
            await fetchImages();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur lors de l\'ajout de l\'image');
        } finally {
            setIsAddingImage(false);
        }
    };

    const openDeleteModal = (type, id) => {
        setDeleteModal({ isOpen: true, type, id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, type: null, id: null });
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModal;

        try {
            if (type === 'image') {
                await booksService.deleteBookImage(parseInt(bookCreatedId), id);
                setImages(images.filter((img) => img.id !== id));
            } else if (type === 'video') {
                await booksService.deleteBookVideo(parseInt(bookCreatedId), id);
                setVideos(videos.filter((vid) => vid.id !== id));
            }
            closeDeleteModal();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur lors de la suppression');
        }
    };

    const handleDeleteImage = (e, imageId) => {
        e.preventDefault();
        e.stopPropagation();
        openDeleteModal('image', imageId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Convertir euros en centimes pour l'API
            const dataToSubmit = {
                ...formData,
                prix: formData.prix * 100,
                nombre_pages: parseInt(formData.nombre_pages) || 0,
                poids_grammes: parseInt(formData.poids_grammes) || 0,
            };

            if (isNew) {
                const createdBook = await booksService.createBook(dataToSubmit);
                // Mettre à jour bookCreatedId pour afficher les sections images et vidéos
                setBookCreatedId(createdBook.id);
                setError(''); // Afficher un message de succès plutôt que de naviguer
            } else {
                await booksService.updateBook(parseInt(id), dataToSubmit);
                navigate('/admin/books');
            }
        } catch (err) {
            if (err instanceof ApiError && err.data) {
                setErrors(err.data);
            } else {
                setError(err instanceof ApiError ? err.message : 'Erreur lors de l\'enregistrement');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">
                {isNew ? 'Créer un nouveau livre' : 'Éditer le livre'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8">
                {/* Title and Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Titre *
                        </label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.titre ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {errors.titre && <p className="text-red-600 text-sm mt-1">{errors.titre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Auteur *
                        </label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Prix (€) *
                        </label>
                        <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`w-full px-4 py-3 border ${errors.prix ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {errors.prix && <p className="text-red-600 text-sm mt-1">{errors.prix}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Stock *
                        </label>
                        <input
                            type="number"
                            name="quantites"
                            value={formData.quantites}
                            onChange={handleChange}
                            min="0"
                            className={`w-full px-4 py-3 border ${errors.quantites ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {errors.quantites && <p className="text-red-600 text-sm mt-1">{errors.quantites}</p>}
                    </div>
                </div>

                {/* Code Bare and Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Code Bare
                        </label>
                        <input
                            type="text"
                            name="code_bare"
                            value={formData.code_bare}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Langue
                        </label>
                        <select
                            name="langue"
                            value={formData.langue}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.langue ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        >
                            {langues.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                        {errors.langue && <p className="text-red-600 text-sm mt-1">{errors.langue}</p>}
                    </div>
                </div>

                {/* Publisher and Pages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Éditeur *
                        </label>
                        <input
                            type="text"
                            name="editeur"
                            value={formData.editeur}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.editeur ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        />
                        {errors.editeur && <p className="text-red-600 text-sm mt-1">{errors.editeur}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Pages
                        </label>
                        <input
                            type="number"
                            name="nombre_pages"
                            value={formData.nombre_pages}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Publication Date and Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Date de publication
                        </label>
                        <input
                            type="date"
                            name="date_publication"
                            value={formData.date_publication}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Poids (g)
                        </label>
                        <input
                            type="number"
                            name="poids_grammes"
                            value={formData.poids_grammes}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Largeur (cm)
                        </label>
                        <input
                            type="text"
                            name="largeur_cm"
                            value={formData.largeur_cm}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Hauteur (cm)
                        </label>
                        <input
                            type="text"
                            name="hauteur_cm"
                            value={formData.hauteur_cm}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Épaisseur (cm)
                        </label>
                        <input
                            type="text"
                            name="epaisseur_cm"
                            value={formData.epaisseur_cm}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* SEO Fields */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Titre SEO
                        </label>
                        <input
                            type="text"
                            name="seo_title"
                            value={formData.seo_title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description SEO
                        </label>
                        <textarea
                            name="seo_description"
                            value={formData.seo_description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>
                </div>

                {/* Images Section */}
                {bookCreatedId && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Images</h2>
                            
                            {/* Add Image Form */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Fichier image *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSelectedImageFile(e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Type *
                                        </label>
                                        <select
                                            value={imageFormData.type}
                                            onChange={(e) => setImageFormData({ ...imageFormData, type: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        >
                                            {imageTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Texte alternatif
                                        </label>
                                        <input
                                            type="text"
                                            value={imageFormData.alt_text}
                                            onChange={(e) => setImageFormData({ ...imageFormData, alt_text: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="Description de l'image"
                                        />
                                    </div>
                                </div>
                                
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={imageFormData.is_main_cover}
                                        onChange={(e) => setImageFormData({ ...imageFormData, is_main_cover: e.target.checked })}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <span className="ml-3 text-gray-900">Couverture principale</span>
                                </label>
                                
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    disabled={isAddingImage || !selectedImageFile}
                                    className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
                                >
                                    <Plus size={18} />
                                    {isAddingImage ? 'Ajout en cours...' : 'Ajouter une image'}
                                </button>
                            </div>

                            {/* Images List */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden h-40">
                                            <img
                                                src={image.image_url}
                                                alt={image.alt_text || 'Image du livre'}
                                                className="w-full h-full object-cover"
                                            />
                                            {image.is_main_cover && (
                                                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded">
                                                    Couverture principale
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteImage(e, image.id)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {images.length === 0 && (
                                <p className="text-gray-500 text-sm">Aucune image ajoutée</p>
                            )}
                        </div>



                        {/* Videos Upload (File Upload) Section */}
                        <div className="mb-8 border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Vidéos (Upload de fichiers)</h2>
                            <BookVideosManager bookId={parseInt(bookCreatedId)} />
                        </div>
                    </>
                )}

                {/* Message before creating */}
                {!bookCreatedId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-700">
                        <p className="font-semibold">Créez d'abord le livre pour ajouter des images et des vidéos</p>
                    </div>
                )}

            {/* Checkboxes */}
            <div className="mb-8 space-y-3 border-b border-gray-200 pb-6">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary rounded"
                    />
                    <span className="ml-3 text-gray-900 font-semibold">Actif</span>
                </label>

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary rounded"
                    />
                    <span className="ml-3 text-gray-900 font-semibold">Livre en vedette</span>
                </label>
            </div>

            {/* Success Message after creation */}
            {isNew && bookCreatedId && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
                    <p className="font-semibold">Livre créé avec succès! Vous pouvez maintenant ajouter des images et des vidéos.</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                {isNew && !bookCreatedId ? (
                    <>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Création...' : 'Créer le livre'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Annuler
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            {isNew && bookCreatedId ? 'Terminer et quitter' : 'Annuler'}
                        </button>
                    </>
                )}
            </div>
        </form>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Confirmer la suppression
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Êtes-vous sûr de vouloir supprimer cette {deleteModal.type === 'image' ? 'image' : 'vidéo'}? Cette action est irreversible.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 border border-gray-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
