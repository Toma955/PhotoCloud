import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { track } from '@vercel/analytics';
import './UploadZone.css';

const UploadZone = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    // Note: You need to create an upload preset in Cloudinary dashboard
    // Go to Settings > Upload > Upload presets > Add upload preset
    // Set signing mode to "Unsigned" and name it "photos_upload"
    formData.append('upload_preset', 'photos_upload');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        id: data.public_id,
        url: data.secure_url,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedPhotos = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }

        const photo = await uploadToCloudinary(file);
        uploadedPhotos.push(photo);
        
        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      onUpload(uploadedPhotos);
      track('photos_uploaded', { count: uploadedPhotos.length });
      
    } catch (error) {
      console.error('Upload failed:', error);
      track('upload_error', { error: error.message });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    handleUpload(acceptedFiles);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className="upload-zone">
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3 className="upload-title">
              {isDragActive ? 'Drop photos here' : 'Upload Photos'}
            </h3>
            <p className="upload-description">
              Drag & drop photos here, or click to select files
            </p>
            <p className="upload-hint">
              Supports JPG, PNG, GIF, WebP up to 10MB each
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadZone; 