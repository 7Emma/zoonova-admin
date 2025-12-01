import React from 'react';

/**
 * Affichage détaillé d'un livre pour le public
 * Affiche toutes les informations du livre
 */
export default function BookDetail({ book }) {
  if (!book) {
    return null;
  }

  const priceEuros = (book.prix / 100).toFixed(2);
  const dimensions = `${book.largeur_cm} × ${book.hauteur_cm} × ${book.epaisseur_cm} cm`;

  return (
    <div className="space-y-8">
      {/* Section principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {book.images && book.images.length > 0 ? (
            <>
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src={book.main_image || book.images[0]?.image_url}
                  alt={book.titre}
                  className="w-full h-full object-cover"
                />
              </div>
              {book.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {book.images.map((img) => (
                    <div
                      key={img.id}
                      className="bg-gray-100 rounded aspect-square overflow-hidden"
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text}
                        className="w-full h-full object-cover hover:scale-105 transition cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-200 rounded-lg aspect-[3/4] flex items-center justify-center">
              <span className="text-gray-500">Pas d'image disponible</span>
            </div>
          )}
        </div>

        {/* Infos principales */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.titre}</h1>
            <p className="text-lg text-gray-600 mb-4">{book.nom}</p>
            <p className="text-gray-600 italic">{book.legende}</p>
          </div>

          {/* Prix et stock */}
          <div className="border-t pt-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-primary">{priceEuros}€</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-white ${
                  book.in_stock
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}
              >
                {book.in_stock ? 'En stock' : 'Rupture de stock'}
              </span>
              {book.in_stock && (
                <span className="text-gray-600">
                  {book.quantites} exemplaire{book.quantites > 1 ? 's' : ''} disponible
                  {book.quantites > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {book.is_featured && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-semibold text-sm">
                  ⭐ Livre mis en avant
                </p>
              </div>
            )}
          </div>

          {/* Infos édition */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Éditeur</span>
              <span className="font-semibold text-gray-900">{book.editeur}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Langue</span>
              <span className="font-semibold text-gray-900">{book.langue}</span>
            </div>
            {book.date_publication && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date de publication</span>
                <span className="font-semibold text-gray-900">
                  {new Date(book.date_publication).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
            {book.code_bare && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ISBN</span>
                <span className="font-semibold text-gray-900 font-mono text-xs">
                  {book.code_bare}
                </span>
              </div>
            )}
          </div>

          {/* Dimensions */}
          <div className="border-t pt-6">
            <div className="space-y-2 text-sm">
              {book.nombre_pages && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre de pages</span>
                  <span className="font-semibold text-gray-900">{book.nombre_pages}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions</span>
                <span className="font-semibold text-gray-900">{dimensions}</span>
              </div>
              {book.poids_grammes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Poids</span>
                  <span className="font-semibold text-gray-900">
                    {(book.poids_grammes / 1000).toFixed(2)} kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="border-t pt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-gray-600">Vues</p>
              <p className="font-bold text-lg">{book.views_count || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-gray-600">Ventes</p>
              <p className="font-bold text-lg">{book.sales_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description complète */}
      {book.description && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-bold text-xl text-gray-900 mb-4">À propos du livre</h2>
          <div className="text-gray-700 whitespace-pre-wrap">
            {book.description}
          </div>
        </div>
      )}

      {/* Vidéos */}
      {book.videos && book.videos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-bold text-xl text-gray-900 mb-4">Vidéos</h2>
          <div className="space-y-6">
            {book.videos.map((video) => (
              <div key={video.id}>
                <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                )}
                <div className="bg-gray-100 rounded-lg aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={extractYouTubeEmbedUrl(video.video_url) || video.video_url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Convertit une URL YouTube en URL d'intégration
 */
function extractYouTubeEmbedUrl(url) {
  if (!url) return null;

  // Format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) {
    return `https://www.youtube.com/embed/${longMatch[1]}`;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
  }

  return null;
}
