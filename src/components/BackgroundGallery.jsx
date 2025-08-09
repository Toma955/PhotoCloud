import React, { useState, useEffect, useCallback } from 'react';
import './BackgroundGallery.css';

const BackgroundGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use hardcoded Cloudinary URLs for background images
  const fetchCloudinaryImages = useCallback(async () => {
    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dtyzo5ynr';
      
      // Hardcoded Cloudinary URLs for background images
      const cloudinaryImages = [
        {
          id: 0,
          src: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-1.jpg`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.2
        },
        {
          id: 1,
          src: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-2.jpg`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.2
        },
        {
          id: 2,
          src: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill/Catering/catering-3.jpg`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.2
        }
      ];
      
      setPhotos(cloudinaryImages);
      
    } catch (error) {
      setPhotos(createSampleImages());
    } finally {
      setLoading(false);
    }
  }, []);

  // Create sample images as fallback
  const createSampleImages = useCallback(() => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504674900240-9d8834146f5d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop'
    ];

    return sampleImages.map((src, index) => ({
      id: index,
      src,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2
    }));
  }, []);

  useEffect(() => {
    fetchCloudinaryImages();

    // Recreate photos every 30 seconds for variety
    const interval = setInterval(() => {
      if (!loading) {
        setPhotos(currentPhotos => 
          currentPhotos.map(photo => ({
            ...photo,
            x: Math.random() * 100,
            y: Math.random() * 100,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            delay: Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.2
          }))
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCloudinaryImages, loading]);

  return (
    <div className={`background-gallery ${loading ? 'loading' : ''}`}>
      {photos.length > 0 ? (
        photos.map((photo) => (
          <div
            key={photo.id}
            className="background-photo"
            style={{
              left: `${photo.x}%`,
              top: `${photo.y}%`,
              transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              opacity: photo.opacity,
              animationDelay: `${photo.delay}s`
            }}
          >
            <img 
              src={photo.src} 
              alt="Catering Šetsanovac" 
              onError={(e) => {
                console.log('Background image failed to load:', photo.src);
                // Try to use a fallback image
                e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop';
              }}
            />
            <div className="photo-reflection"></div>
          </div>
        ))
      ) : (
        // Show fallback images when no Cloudinary images are available
        createSampleImages().map((photo) => (
          <div
            key={photo.id}
            className="background-photo"
            style={{
              left: `${photo.x}%`,
              top: `${photo.y}%`,
              transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
              opacity: photo.opacity,
              animationDelay: `${photo.delay}s`
            }}
          >
            <img 
              src={photo.src} 
              alt="Catering Šetsanovac" 
              onError={(e) => {
                console.log('Fallback image failed to load:', photo.src);
                // Hide the image if it fails to load
                e.target.style.display = 'none';
              }}
            />
            <div className="photo-reflection"></div>
          </div>
        ))
      )}
      
      {/* Additional floating elements */}
      <div className="floating-element floating-1">🍽️</div>
      <div className="floating-element floating-2">🥂</div>
      <div className="floating-element floating-3">🎨</div>
      <div className="floating-element floating-4">⭐</div>
      <div className="floating-element floating-5">✨</div>
    </div>
  );
};

export default BackgroundGallery; 