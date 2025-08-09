import React from 'react';
import './GoogleMap.css';

const GoogleMap = () => {
  return (
    <div className="google-map-container">
      <h2 className="map-title">Catering</h2>
      <h3 className="map-subtitle">Šetsanovac</h3>
      <div className="map-frame">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388077697!2d16.2334!3d45.8333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765a6c0c8c8c8c8%3A0x8c8c8c8c8c8c8c8!2s%C5%A0etsanovac%2C%20Croatia!5e0!3m2!1sen!2shr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Šetsanovac Location"
        ></iframe>
      </div>
      <div className="map-overlay">
        <div className="location-pin">
          <span className="pin-icon">📍</span>
          <span className="pin-text">Šetsanovac</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap; 