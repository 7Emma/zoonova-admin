import React, { useState, useEffect } from 'react';
import { bookVideosService, ApiError } from '../../services';
import { Upload, Trash2, Loader } from 'lucide-react';

export default function BookVideosManager({ bookId, onVideoAdded }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    order: 0,
  });

  useEffect(() => {
    if (bookId) {
      fetchVideos();
    }
  }, [bookId]);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await bookVideosService.getVideosByBook(bookId);
      // La réponse peut être un array ou un objet avec results
      const videosList = Array.isArray(response) ? response : (response.results || []);
      setVideos(videosList);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors du chargement des vidéos'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!bookVideosService.isValidVideoFile(file)) {
        setError('Format de fichier non supporté. Acceptés: MP4, WebM, OGG, MOV');
        return;
      }
      if (!bookVideosService.isValidVideoSize(file)) {
        setError('Le fichier ne doit pas dépasser 500MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (videos.length > 0) {
      setError('Une vidéo existe déjà pour ce livre. Veuillez la supprimer avant d\'en ajouter une nouvelle.');
      return;
    }
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier vidéo');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await bookVideosService.createVideo({
        book: bookId,
        video_file: selectedFile,
        title: videoData.title || selectedFile.name,
        description: videoData.description,
        order: videoData.order,
      });

      setVideos([...videos, response]);
      setSelectedFile(null);
      setVideoData({ title: '', description: '', order: 0 });
      setSuccess('Vidéo ajoutée avec succès');
      
      if (onVideoAdded) {
        onVideoAdded(response);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de l\'upload'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo?')) return;

    setError('');
    setSuccess('');

    try {
      await bookVideosService.deleteVideo(videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
      setSuccess('Vidéo supprimée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Erreur lors de la suppression'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une vidéo</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-green-700 text-sm">
            {success}
          </div>
        )}

        {videos.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-yellow-700 text-sm">
            Une vidéo existe déjà pour ce livre. Vous ne pouvez ajouter qu'une seule vidéo.
          </div>
        )}

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Fichier vidéo (MP4, WebM, OGG, MOV - Max 500MB)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileChange}
                disabled={isUploading || videos.length > 0}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Titre de la vidéo (optionnel)
            </label>
            <input
              type="text"
              value={videoData.title}
              onChange={(e) =>
                setVideoData({ ...videoData, title: e.target.value })
              }
              disabled={isUploading || videos.length > 0}
              placeholder="Ex: Présentation du livre"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={videoData.description}
              onChange={(e) =>
                setVideoData({ ...videoData, description: e.target.value })
              }
              disabled={isUploading || videos.length > 0}
              placeholder="Description de la vidéo..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Order Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={videoData.order}
              onChange={(e) =>
                setVideoData({ ...videoData, order: parseInt(e.target.value) })
              }
              disabled={isUploading || videos.length > 0}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || videos.length > 0}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload la vidéo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Videos List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : videos.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vidéos ({videos.length})
          </h3>
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {video.title || 'Vidéo sans titre'}
                  </h4>
                  {video.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Ordre: {video.order}</span>
                    <span>
                      {new Date(video.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {video.video_url && (
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-secondary mt-2 inline-block"
                    >
                      Voir la vidéo →
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="ml-4 text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                  title="Supprimer la vidéo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Aucune vidéo ajoutée pour ce livre</p>
        </div>
      )}
    </div>
  );
}
