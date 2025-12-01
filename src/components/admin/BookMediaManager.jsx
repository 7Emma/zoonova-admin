import React, { useState, useRef } from 'react';
import { booksService, videosService, ApiError } from '../../services';

/**
 * Gestionnaire média (images et vidéos) pour un livre
 * Permet d'ajouter, modifier et supprimer images et vidéos
 */
export default function BookMediaManager({ bookId, initialImages = [], initialVideos = [], onUpdate }) {
  const [images, setImages] = useState(initialImages);
  const [videos, setVideos] = useState(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // ====== Gestion des images ======

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'cover_front');
    formData.append('alt_text', '');

    setIsLoading(true);
    setError('');

    try {
      const response = await booksService.addBookImage(bookId, formData);
      setImages([...images, response.image]);
      setSuccess('Image ajoutée avec succès');
      setTimeout(() => setSuccess(''), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de l\'ajout de l\'image'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    setIsLoading(true);
    setError('');

    try {
      await booksService.deleteBookImage(bookId, imageId);
      setImages(images.filter((img) => img.id !== imageId));
      setSuccess('Image supprimée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la suppression'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetMainCover = async (imageId) => {
    setIsLoading(true);
    setError('');

    try {
      await booksService.updateBook(bookId, { main_image: imageId });
      setImages(
        images.map((img) => ({
          ...img,
          is_main_cover: img.id === imageId,
        }))
      );
      setSuccess('Couverture principale définie');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  // ====== Gestion des vidéos ======

  const [videoForm, setVideoForm] = useState({
    video_url: '',
    title: '',
    description: '',
  });

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setError('');

    if (!videosService.isValidVideoUrl(videoForm.video_url)) {
      setError('URL YouTube ou Vimeo invalide');
      return;
    }

    setIsLoading(true);

    try {
      const response = await booksService.addBookVideo(bookId, {
        ...videoForm,
        order: videos.length,
      });
      setVideos([...videos, response.video]);
      setVideoForm({ video_url: '', title: '', description: '' });
      setSuccess('Vidéo ajoutée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de l\'ajout'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    setIsLoading(true);
    setError('');

    try {
      await booksService.deleteBookVideo(bookId, videoId);
      setVideos(videos.filter((vid) => vid.id !== videoId));
      setSuccess('Vidéo supprimée');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Section Images */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Images</h3>

        {/* Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Ajouter une image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-primary hover:text-secondary font-semibold disabled:text-gray-400"
            >
              Cliquez pour sélectionner une image
            </button>
          </div>
        </div>

        {/* Liste des images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={image.image_url}
                alt={image.alt_text}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 space-y-2">
                {image.is_main_cover && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Couverture principale
                  </span>
                )}
                <div className="flex gap-2">
                  {!image.is_main_cover && (
                    <button
                      onClick={() => handleSetMainCover(image.id)}
                      disabled={isLoading}
                      className="flex-1 text-sm bg-blue-50 text-blue-700 py-1 rounded hover:bg-blue-100 disabled:bg-gray-50"
                    >
                      Mettre en avant
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={isLoading}
                    className="flex-1 text-sm bg-red-50 text-red-700 py-1 rounded hover:bg-red-100 disabled:bg-gray-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune image pour ce livre
          </p>
        )}
      </div>

      {/* Section Vidéos */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Vidéos</h3>

        {/* Formulaire ajout vidéo */}
        <form onSubmit={handleAddVideo} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              URL YouTube ou Vimeo
            </label>
            <input
              type="url"
              name="video_url"
              value={videoForm.video_url}
              onChange={handleVideoChange}
              disabled={isLoading}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Titre
            </label>
            <input
              type="text"
              name="title"
              value={videoForm.title}
              onChange={handleVideoChange}
              disabled={isLoading}
              placeholder="Titre de la vidéo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={videoForm.description}
              onChange={handleVideoChange}
              disabled={isLoading}
              rows="2"
              placeholder="Description de la vidéo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400"
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter la vidéo'}
          </button>
        </form>

        {/* Liste des vidéos */}
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{video.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{video.description}</p>
              <p className="text-xs text-gray-500 mb-3 truncate">{video.video_url}</p>
              <button
                onClick={() => handleDeleteVideo(video.id)}
                disabled={isLoading}
                className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100 disabled:bg-gray-50"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune vidéo pour ce livre
          </p>
        )}
      </div>
    </div>
  );
}
