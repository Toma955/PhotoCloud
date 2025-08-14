import React, { useState, useEffect, useCallback } from 'react';
import './BackgroundGallery.css';
import cateringPhotos from '../data/catering-photos.json';

const BackgroundGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Test if image can be loaded
  const testImageLoad = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  // Load images from the catering photos JSON file
  const loadCateringImages = useCallback(async () => {
    try {
      console.log('📁 Starting to load catering images...');
      console.log('📊 Total images to load:', cateringPhotos.images.length);
      
      // Get all images from the catering photos
      const allPhotos = cateringPhotos.images.map((photo) => ({
        id: photo.id,
        src: photo.jpgUrl, // Use JPG version for better performance
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.2,
        title: photo.title,
        category: photo.category
      }));
      
      console.log('🖼️ Created photo objects:', allPhotos.length);
      
      // Test which images can actually be loaded
      const loadablePhotos = [];
      for (let i = 0; i < allPhotos.length; i++) {
        const photo = allPhotos[i];
        console.log(`🔍 Testing image ${i + 1}/${allPhotos.length}: ${photo.src}`);
        
        const canLoad = await testImageLoad(photo.src);
        if (canLoad) {
          loadablePhotos.push(photo);
          console.log(`✅ Image ${photo.src} is loadable`);
        } else {
          console.log(`❌ Image ${photo.src} failed to load`);
        }
      }
      
      console.log(`✅ Found ${loadablePhotos.length} loadable images out of ${allPhotos.length}`);
      
      if (loadablePhotos.length === 0) {
        console.log('⚠️ No cloud images could be loaded, using fallback images');
        setError('No cloud images could be loaded');
        const samplePhotos = createSampleImages();
        setPhotos(samplePhotos);
      } else {
        // Take random photos from loadable ones
        const randomPhotos = loadablePhotos
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(8, loadablePhotos.length));
        
        setPhotos(randomPhotos);
        console.log('🎯 Background photos set:', randomPhotos.length);
      }
      
    } catch (error) {
      console.error('❌ Error loading catering images:', error);
      setError(error.message);
      const samplePhotos = createSampleImages();
      setPhotos(samplePhotos);
    } finally {
      setLoading(false);
      console.log('🏁 Loading finished');
    }
  }, [createSampleImages]);

  useEffect(() => {
    console.log('🔄 Starting to load images...');
    loadCateringImages();

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
  }, [loadCateringImages, loading]);

  return (
    <div className={`background-gallery ${loading ? 'loading' : ''}`}>
      {error && (
        <div className="error-message" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          Error: {error}
        </div>
      )}
      
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
              alt={photo.title || "Catering Šetsanovac"} 
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
        // Show fallback images when no catering images are available
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