import React, { useState } from 'react';
import './PhotoCard.css';

const PhotoCard = ({ photo, index, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (hasError) {
    return (
      <div className="photo-card error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <p>Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-card" onClick={onClick}>
      <div className="photo-container">
        <img
          src={photo.url}
          alt={photo.name}
          className={`photo-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {!isLoaded && !hasError && (
          <div className="loading-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      
      <div className="photo-info">
        <div className="photo-name">{photo.name}</div>
        <div className="photo-meta">
          <span className="photo-size">{formatFileSize(photo.size)}</span>
          <span className="photo-date">{formatDate(photo.uploadedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard; 