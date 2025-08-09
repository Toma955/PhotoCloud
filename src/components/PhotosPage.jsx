import React, { useState, useEffect } from 'react';
import './PhotosPage.css';

const PhotosPage = ({ onNavigateToHome }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use hardcoded Cloudinary URLs for Catering images
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dtyzo5ynr';
        
        // Hardcoded Cloudinary URLs for Catering images
        const cateringImages = [
          {
            id: 1,
            src: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill/Catering/catering-1.jpg`,
            srcLarge: `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill/Catering/catering-1.jpg`,
            srcThumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-1.jpg`,
            title: 'Catering Setup 1',
            description: 'Professional catering service',
            originalName: 'catering-1.jpg',
            uploadedAt: new Date().toISOString(),
            size: 1024000,
            format: 'JPG',
            publicId: 'Catering/catering-1'
          },
          {
            id: 2,
            src: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill/Catering/catering-2.jpg`,
            srcLarge: `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill/Catering/catering-2.jpg`,
            srcThumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-2.jpg`,
            title: 'Catering Setup 2',
            description: 'Professional catering service',
            originalName: 'catering-2.jpg',
            uploadedAt: new Date().toISOString(),
            size: 1024000,
            format: 'JPG',
            publicId: 'Catering/catering-2'
          },
          {
            id: 3,
            src: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill/Catering/catering-3.jpg`,
            srcLarge: `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill/Catering/catering-3.jpg`,
            srcThumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-3.jpg`,
            title: 'Catering Setup 3',
            description: 'Professional catering service',
            originalName: 'catering-3.jpg',
            uploadedAt: new Date().toISOString(),
            size: 1024000,
            format: 'JPG',
            publicId: 'Catering/catering-3'
          }
        ];
        
        setPhotos(cateringImages);
        
              } catch (error) {
          setError('Greška pri učitavanju slika');
          setPhotos([]);
        } finally {
          setLoading(false);
        }
    };

    fetchPhotos();
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleBackToHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      window.location.href = '/';
    }
  };



  return (
    <div className="photos-page">
      {/* Header */}
      <div className="photos-header">
        <button className="back-button" onClick={handleBackToHome}>
          ← Povratak
        </button>
        <h1 className="photos-title">Catering Galerija</h1>
        <div className="header-spacer"></div>

      </div>

      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Učitavanje slika...</p>
        </div>
      )}

      {/* Photos Grid */}
      {!loading && !error && photos.length > 0 && (
        <div className="photos-grid">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-item"
              onClick={() => handlePhotoClick(photo)}
            >
              <img 
                src={photo.srcThumbnail} 
                alt={photo.title}
                className="photo-image"
                loading="lazy"
                onError={(e) => {
                  console.log('❌ Image failed to load:', photo.srcThumbnail);
                  e.target.src = photo.src; // Fallback to medium size
                }}
              />
              <div className="photo-overlay">
                <h3 className="photo-title">{photo.title}</h3>
                <p className="photo-description">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && photos.length === 0 && (
        <div className="empty-container">
          <p className="empty-text">Nema slika u galeriji</p>
        </div>
      )}

      {/* Modal for full-size photo */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <img 
              src={selectedPhoto.srcLarge} 
              alt={selectedPhoto.title}
              className="modal-image"
              onError={(e) => {
                console.log('❌ Modal image failed to load:', selectedPhoto.srcLarge);
                e.target.src = selectedPhoto.src; // Fallback to medium size
              }}
            />
            <div className="modal-info">
              <h2 className="modal-title">{selectedPhoto.title}</h2>
              <p className="modal-description">{selectedPhoto.description}</p>
              {selectedPhoto.originalName && (
                <p className="modal-filename">Datoteka: {selectedPhoto.originalName}</p>
              )}
              {selectedPhoto.publicId && (
                <p className="modal-filename">ID: {selectedPhoto.publicId}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosPage; 