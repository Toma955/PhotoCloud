import React, { useState, useEffect, useCallback } from 'react';
import { track } from '@vercel/analytics';
import './Slideshow.css';

const Slideshow = ({ photos, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  const currentPhoto = photos[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      default:
        break;
    }
  }, [onClose, goToNext, goToPrevious]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setIsLoading(true);
    track('slideshow_navigated', { index: currentIndex });
  }, [currentIndex]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="slideshow-overlay" onClick={onClose}>
      <div className="slideshow-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="slideshow-close" onClick={onClose} aria-label="Close slideshow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Navigation Buttons */}
        <button 
          className="slideshow-nav slideshow-prev" 
          onClick={goToPrevious}
          aria-label="Previous photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          className="slideshow-nav slideshow-next" 
          onClick={goToNext}
          aria-label="Next photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Main Image */}
        <div className="slideshow-image-container">
          {isLoading && (
            <div className="slideshow-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img
            src={currentPhoto.url}
            alt={currentPhoto.name}
            className={`slideshow-image ${isLoading ? 'loading' : 'loaded'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        {/* Photo Info */}
        <div className="slideshow-info">
          <div className="slideshow-info-content">
            <h3 className="slideshow-title">{currentPhoto.name}</h3>
            <div className="slideshow-meta">
              <span className="slideshow-size">{formatFileSize(currentPhoto.size)}</span>
              <span className="slideshow-date">{formatDate(currentPhoto.uploadedAt)}</span>
            </div>
            <div className="slideshow-counter">
              {currentIndex + 1} of {photos.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="slideshow-progress">
          <div 
            className="slideshow-progress-fill"
            style={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow; 