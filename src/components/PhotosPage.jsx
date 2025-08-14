import React, { useState, useEffect } from 'react';
import './PhotosPage.css';
import cateringPhotos from '../data/catering-photos.json';
import projectionScreenIcon from '../icons/projection-screen.png';
import downloadIcon from '../icons/Dowland.png';

const PhotosPage = ({ onNavigateToHome }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(1); // 1 for 1 row, 2 for 2 rows, 3 for 3 rows, 4 for 4 rows
  const [masonryLayout, setMasonryLayout] = useState(false); // Enable/disable masonry layout
  const [downloadingPhoto, setDownloadingPhoto] = useState(null); // Track which photo is being downloaded
  const [selectMode, setSelectMode] = useState(false); // Enable/disable selection mode
  const [selectedPhotos, setSelectedPhotos] = useState(new Set()); // Track selected photos
  const [modalPhoto, setModalPhoto] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragEndX, setDragEndX] = useState(0);

  // Load images from the catering photos JSON file
  useEffect(() => {
    const loadCateringPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Transform the catering photos data to match the expected format
        const transformedPhotos = cateringPhotos.images.map((photo) => ({
          id: photo.id,
          src: photo.jpgUrl, // Medium size
          srcLarge: photo.jpgUrl, // Large size (same as medium for now)
          srcThumbnail: photo.jpgUrl, // Thumbnail size (same as medium for now)
          title: photo.title,
          description: photo.description,
          category: photo.category,
          originalName: `${photo.photoNumber}.JPG`,
          uploadedAt: new Date().toISOString(),
          size: 1024000, // Default size
          format: 'JPG',
          publicId: photo.photoNumber,
          featured: photo.featured,
          // Add aspect ratio for masonry layout
          aspectRatio: 1.5 // Default aspect ratio, will be calculated dynamically
        }));
        
        setPhotos(transformedPhotos);
        
      } catch (error) {
        console.error('Error loading catering photos:', error);
        setError('Greška pri učitavanju slika');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    loadCateringPhotos();
  }, []);

  // Calculate aspect ratios for masonry layout
  useEffect(() => {
    if (photos.length > 0 && masonryLayout) {
      const calculateAspectRatios = async () => {
        const photosWithRatios = await Promise.all(
          photos.map(async (photo) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                const aspectRatio = img.width / img.height;
                resolve({ ...photo, aspectRatio });
              };
              img.onerror = () => {
                resolve({ ...photo, aspectRatio: 1.5 }); // Default fallback
              };
              img.src = photo.src;
            });
          })
        );
        setPhotos(photosWithRatios);
      };
      
      calculateAspectRatios();
    }
  }, [masonryLayout]);

  const handlePhotoClick = (photo) => {
    if (selectMode) {
      handlePhotoSelect(photo.id);
      return;
    }
    
    // Open modal with the clicked photo
    const photoIndex = photos.findIndex(p => p.id === photo.id);
    setModalIndex(photoIndex);
    setModalPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPhoto(null);
    setModalIndex(0);
  };

  const goToPrevious = () => {
    if (modalIndex > 0) {
      const newIndex = modalIndex - 1;
      setModalIndex(newIndex);
      setModalPhoto(photos[newIndex]);
    }
  };

  const goToNext = () => {
    if (modalIndex < photos.length - 1) {
      const newIndex = modalIndex + 1;
      setModalIndex(newIndex);
      setModalPhoto(photos[newIndex]);
    }
  };

  const handleModalDownload = (photo) => {
    handleDownload(photo, { stopPropagation: () => {} });
  };

  const handleProjection = () => {
    setIsProjectionMode(prev => !prev);
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  // Handle ESC key to exit projection mode
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && isProjectionMode) {
        setIsProjectionMode(false);
      }
    };

    if (isProjectionMode) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isProjectionMode]);

  // Handle keyboard navigation (arrow keys and A/D keys)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isModalOpen) {
        // Arrow key and A/D navigation for desktop mode
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          if (modalIndex > 0) {
            goToPrevious();
          }
        }
        
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          if (modalIndex < photos.length - 1) {
            goToNext();
          }
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isModalOpen, modalIndex, photos.length]);

  const handleModalSelect = (photo) => {
    handlePhotoSelect(photo.id);
  };

  const handleModalDragStart = (e) => {
    setDragStartX(e.clientX);
  };

  const handleModalDragEnd = (e) => {
    setDragEndX(e.clientX);
    const dragDistance = dragStartX - dragEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(dragDistance) > minSwipeDistance) {
      if (dragDistance > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrevious();
      }
    }
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

  const handleDownload = (photo, event) => {
    event.stopPropagation(); // Prevent modal from opening
    
    // Check if photo has valid URL
    if (!photo.srcLarge || photo.srcLarge === '') {
      console.error('❌ No valid image URL for:', photo.title);
      alert('Greška: Slika nema validan URL za preuzimanje');
      return;
    }
    
    // Set loading state
    setDownloadingPhoto(photo.id);
    console.log('📥 Starting download for:', photo.title, 'URL:', photo.srcLarge);
    
    // Force download using fetch and blob - this prevents opening the image
    fetch(photo.srcLarge, {
      method: 'GET',
      mode: 'cors', // Try CORS first
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create blob URL
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create download link with blob URL
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = photo.originalName || `${photo.title || 'catering'}.jpg`;
        
        // Append to DOM, click, and remove
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(blobUrl);
        
        console.log('✅ Download completed for:', photo.title);
        setDownloadingPhoto(null);
      })
      .catch(error => {
        console.error('❌ CORS download failed, trying no-cors:', error);
        
        // Fallback: try no-cors mode
        fetch(photo.srcLarge, {
          method: 'GET',
          mode: 'no-cors',
        })
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = photo.originalName || `${photo.title || 'catering'}.jpg`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            window.URL.revokeObjectURL(blobUrl);
            
            console.log('✅ No-cors download completed for:', photo.title);
            setDownloadingPhoto(null);
          })
          .catch(noCorsError => {
            console.error('❌ No-cors download also failed:', noCorsError);
            setDownloadingPhoto(null);
            
            // Last resort: show error message
            alert('Greška: Ne može se preuzeti slika. Pokušajte ponovo.');
          });
      });
  };

  const handleDownloadAll = () => {
    photos.forEach(photo => {
      const link = document.createElement('a');
      link.href = photo.srcLarge;
      link.download = photo.originalName || `${photo.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownloadSelected = () => {
    if (selectedPhotos.size === 0) {
      alert('Nema označenih slika za preuzimanje');
      return;
    }
    
    console.log(`📥 Starting bulk download for ${selectedPhotos.size} selected photos...`);
    console.log('🔍 Selected photo IDs:', Array.from(selectedPhotos));
    console.log('🔍 Available photos:', photos.map(p => ({ id: p.id, title: p.title, srcLarge: p.srcLarge })));
    
    let successCount = 0;
    let errorCount = 0;
    let completedCount = 0;
    
    const processDownload = (photo, index) => {
      console.log(`🔄 Processing download ${index + 1}/${selectedPhotos.size}: ${photo.title}`);
      console.log(`🔍 Photo URL: ${photo.srcLarge}`);
      
      // Force download using fetch and blob with CORS handling
      fetch(photo.srcLarge, {
        method: 'GET',
        mode: 'cors', // Try CORS first
      })
        .then(response => {
          console.log(`📡 Response status: ${response.status}, ok: ${response.ok}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          console.log(`📦 Blob created, size: ${blob.size} bytes`);
          
          // Create blob URL
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Create download link with blob URL
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = photo.originalName || `${photo.title || 'catering'}.jpg`;
          
          // Append to DOM, click, and remove
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Clean up blob URL
          window.URL.revokeObjectURL(blobUrl);
          
          successCount++;
          completedCount++;
          console.log(`✅ Downloaded: ${photo.title} (${successCount}/${selectedPhotos.size})`);
          
          // Check if all downloads are completed
          if (completedCount === selectedPhotos.size) {
            showDownloadSummary();
          }
        })
        .catch(error => {
          console.error(`❌ CORS download failed for ${photo.title}, trying no-cors:`, error);
          
          // Fallback: try no-cors mode
          fetch(photo.srcLarge, {
            method: 'GET',
            mode: 'no-cors',
          })
            .then(response => {
              console.log(`📡 No-cors response status: ${response.status}, type: ${response.type}`);
              return response.blob();
            })
            .then(blob => {
              console.log(`📦 No-cors blob created, size: ${blob.size} bytes`);
              
              const blobUrl = window.URL.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.href = blobUrl;
              downloadLink.download = photo.originalName || `${photo.title || 'catering'}.jpg`;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              window.URL.revokeObjectURL(blobUrl);
              
              successCount++;
              completedCount++;
              console.log(`✅ No-cors download completed for: ${photo.title} (${successCount}/${selectedPhotos.size})`);
              
              // Check if all downloads are completed
              if (completedCount === selectedPhotos.size) {
                showDownloadSummary();
              }
            })
            .catch(noCorsError => {
              console.error(`❌ No-cors download also failed for ${photo.title}:`, noCorsError);
              errorCount++;
              completedCount++;
              
              // Check if all downloads are completed
              if (completedCount === selectedPhotos.size) {
                showDownloadSummary();
              }
            });
        });
    };
    
    const showDownloadSummary = () => {
      console.log(`🏁 Download summary - Success: ${successCount}, Errors: ${errorCount}, Completed: ${completedCount}`);
      if (successCount > 0) {
        alert(`Preuzimanje završeno!\nUspješno: ${successCount}\nGreške: ${errorCount}`);
      } else {
        alert('Greška: Nije uspjelo preuzeti nijednu sliku.');
      }
    };
    
    // Process downloads with delay
    selectedPhotos.forEach((photoId, index) => {
      const photo = photos.find(p => p.id === photoId);
      if (photo) {
        console.log(`⏰ Scheduling download ${index + 1} for photo: ${photo.title}`);
        setTimeout(() => {
          processDownload(photo, index);
        }, index * 300); // 300ms delay between downloads
      } else {
        console.error(`❌ Photo with ID ${photoId} not found in photos array`);
        errorCount++;
        completedCount++;
        
        // Check if all downloads are completed
        if (completedCount === selectedPhotos.size) {
          showDownloadSummary();
        }
      }
    });
  };

  const handleViewToggle = () => {
    setViewMode(prevMode => {
      if (prevMode === 1) return 2;
      if (prevMode === 2) return 3;
      if (prevMode === 3) return 4;
      return 1; // Default to 1
    });
  };

  const toggleMasonryLayout = () => {
    setMasonryLayout(!masonryLayout);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      // Clear selection when exiting select mode
      setSelectedPhotos(new Set());
    }
  };

  const handlePhotoSelect = (photoId, event) => {
    if (event) {
      event.stopPropagation(); // Prevent modal from opening
    }
    
    setSelectedPhotos(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(photoId)) {
        newSelection.delete(photoId);
      } else {
        newSelection.add(photoId);
      }
      return newSelection;
    });
  };

  return (
    <div className="photos-page">
      {/* Header */}
      <div className="photos-header">
        <button className="back-button" onClick={handleBackToHome}>
          ← Povratak
        </button>
        <h1 className="photos-title">Catering Galerija</h1>
        <div className="header-actions">
          <div className="image-count">
            {photos.length} slika
          </div>
          <button 
            className="download-all-button"
            onClick={selectMode ? handleDownloadSelected : handleDownloadAll}
            disabled={selectMode ? selectedPhotos.size === 0 : photos.length === 0}
            title={selectMode ? `Preuzmi označene (${selectedPhotos.size})` : 'Preuzmi sve'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>{selectMode ? `Preuzmi označene (${selectedPhotos.size})` : 'Preuzmi sve'}</span>
          </button>
          <button className="view-toggle-button" onClick={() => handleViewToggle()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path 
                d="M4 6h16M4 10h16M4 14h16M4 18h16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {viewMode === 1 ? '1 red' : viewMode === 2 ? '2 reda' : viewMode === 3 ? '3 reda' : '4 reda'}
          </button>
          <button 
            className={`masonry-toggle-button ${masonryLayout ? 'active' : ''}`} 
            onClick={toggleMasonryLayout}
            title="Masonry layout - popuni prazne prostore između slika"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path 
                d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {masonryLayout ? 'Masonry' : 'Masonry'}
          </button>
          <button 
            className={`select-toggle-button ${selectMode ? 'active' : ''}`} 
            onClick={toggleSelectMode}
            title="Označi slike - klikni na slike za označavanje"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path 
                d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {selectMode ? `Označeno ${selectedPhotos.size}` : 'Označi'}
          </button>
        </div>
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
        <div 
          className={`photos-grid ${masonryLayout ? 'masonry' : ''}`}
          style={!masonryLayout ? {
            gridTemplateColumns: `repeat(${viewMode}, 1fr)`
          } : {}}
          data-columns={masonryLayout ? viewMode : undefined}
        >
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-item"
              onClick={() => {
                handlePhotoClick(photo);
              }}
              style={masonryLayout ? {
                height: 'auto',
                aspectRatio: photo.aspectRatio || 1.5
              } : {}}
            >
              <img 
                src={photo.srcThumbnail} 
                alt={photo.title}
                className="photo-image"
                loading="lazy"
                onError={(e) => {
                  console.log('❌ Thumbnail failed to load:', photo.srcThumbnail);
                  // Try medium size as fallback
                  if (e.target.src !== photo.src) {
                    e.target.src = photo.src;
                  } else {
                    // If medium also fails, hide the image
                    e.target.style.display = 'none';
                  }
                }}
              />
              
              {/* Selection Checkbox */}
              {selectMode && (
                <div 
                  className={`selection-checkbox ${selectedPhotos.has(photo.id) ? 'selected' : ''}`}
                  onClick={(e) => handlePhotoSelect(photo.id, e)}
                >
                  {selectedPhotos.has(photo.id) && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3"/>
                    </svg>
                  )}
                </div>
              )}
              
              {/* Download Button */}
              <button 
                className={`download-button ${downloadingPhoto === photo.id ? 'downloading' : ''}`}
                onClick={(e) => handleDownload(photo, e)}
                title={`Preuzmi sliku: ${photo.title}`}
                disabled={downloadingPhoto === photo.id}
              >
                {downloadingPhoto === photo.id ? (
                  <div className="download-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )}
              </button>
              
              <div className="photo-overlay">
                <div className="photo-info">
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                  <div className="photo-category">{photo.category}</div>
                </div>
                
                {/* Checkmark Overlay for selected grid images */}
                {selectedPhotos.has(photo.id) && (
                  <div className="grid-checkmark-overlay">
                    <span className="grid-checkmark-symbol">✓</span>
                  </div>
                )}
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
      {isModalOpen && modalPhoto && (
        <div className="photo-modal" onClick={closeModal} onDragStart={handleModalDragStart} onDragEnd={handleModalDragEnd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Background Image with Blur Effect */}
            <div 
              className="modal-background-image"
              style={{
                backgroundImage: `url(${modalPhoto.srcLarge})`,
                filter: 'blur(20px) brightness(0.7)'
              }}
            />
            
            {/* Main Modal Image */}
            <div className="modal-image-wrapper">
              <img
                src={modalPhoto.srcLarge}
                alt={modalPhoto.title}
                className={`modal-image ${isProjectionMode ? 'projection-mode' : ''} ${isProjectionMode ? (imageDimensions.width > imageDimensions.height ? 'landscape-projection' : 'portrait-projection') : ''}`}
                onClick={isProjectionMode ? () => setIsProjectionMode(false) : undefined}
                style={{ cursor: isProjectionMode ? 'pointer' : 'default' }}
                onError={(e) => {
                  console.error('❌ Large image failed to load:', modalPhoto.title);
                  // Try medium size as fallback
                  if (modalPhoto.src && modalPhoto.src !== modalPhoto.srcLarge) {
                    e.target.src = modalPhoto.src;
                  } else {
                    // If medium also fails, show error message
                    e.target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'modal-image-error';
                    errorDiv.innerHTML = `
                      <div style="text-align: center; padding: 40px; color: var(--apple-text-secondary);">
                        <p>❌ Slika se ne može učitati</p>
                        <p>${modalPhoto.title}</p>
                      </div>
                    `;
                    e.target.parentNode.appendChild(errorDiv);
                  }
                }}
                onLoad={handleImageLoad}
              />
              
              {/* Checkmark Overlay when image is selected */}
              {selectedPhotos.has(modalPhoto.id) && (
                <div className="checkmark-overlay">
                  <span className="checkmark-symbol">✓</span>
                </div>
              )}
            </div>
            
            {/* Image Controls - Top Left Corner */}
            <div className="image-controls">
              <button className="control-circle red-circle" title="Zatvori" onClick={closeModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <button 
                className={`control-circle green-circle ${selectedPhotos.has(modalPhoto.id) ? 'selected' : ''}`} 
                title="Označi" 
                onClick={() => handleModalSelect(modalPhoto)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </button>
              
              <button className="control-circle blue-circle" title="Preuzmi" onClick={() => handleModalDownload(modalPhoto)}>
                <img 
                  src={downloadIcon} 
                  alt="Preuzmi" 
                  width="18" 
                  height="18"
                  style={{filter: 'brightness(0) invert(1)'}}
                />
              </button>
              
              <button className={`control-circle yellow-circle ${isProjectionMode ? 'active' : ''}`} title="Projekcija" onClick={handleProjection}>
                <img 
                  src={projectionScreenIcon} 
                  alt="Projekcija" 
                  width="18" 
                  height="18"
                  style={{filter: 'brightness(0) invert(1)'}}
                />
              </button>
            </div>
            
            {/* Modal Info */}
            <div className="modal-info">
            </div>
            
            {/* Action Buttons with Navigation */}
            <div className="modal-actions">
              <button 
                className="nav-arrow prev-arrow" 
                onClick={goToPrevious} 
                disabled={modalIndex === 0}
                title="Prethodna slika (←, A ili klik)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
              </button>
              
              <div className="image-counter">
                {modalIndex + 1} / {photos.length}
              </div>
              
              <button 
                className="nav-arrow next-arrow" 
                onClick={goToNext} 
                disabled={modalIndex === photos.length - 1}
                title="Sljedeća slika (→, D ili klik)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;