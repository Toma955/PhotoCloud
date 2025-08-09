import React from 'react';
import PhotoCard from './PhotoCard';
import './PhotoGrid.css';

const PhotoGrid = ({ photos, onPhotoClick }) => {
  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          onClick={() => onPhotoClick(index)}
        />
      ))}
    </div>
  );
};

export default PhotoGrid; 