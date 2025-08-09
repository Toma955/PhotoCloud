import React from 'react';
import PhotoCard from './PhotoCard';
import './PhotoList.css';

const PhotoList = ({ photos, onPhotoClick }) => {
  return (
    <div className="photo-list">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          onClick={() => onPhotoClick(index)}
          isList={true}
        />
      ))}
    </div>
  );
};

export default PhotoList; 