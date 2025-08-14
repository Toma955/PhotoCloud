import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import ThemeToggle from './ThemeToggle';
import './CateringMap.css';

const CateringMap = ({ theme, toggleTheme, onNavigateToPhotos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleOpenFolder = () => {
    // Allow navigation immediately
    if (onNavigateToPhotos) {
      onNavigateToPhotos();
    } else {
      window.location.href = '/photos';
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('hr-HR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    // Set time to 8 PM
    const eveningTime = new Date(date);
    eveningTime.setHours(20, 0, 0, 0);
    
    return eveningTime.toLocaleTimeString('hr-HR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="catering-map">
      <div className="map-container">
        {/* Map Content */}
        <div className="map-content">
          <div className="map-header">
            <h2 className="map-title">Catering</h2>
            <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
          </div>
          
          {/* Map Section */}
          <div className="map-section">
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
              <div className="map-overlay">
                <div className="location-pin">
                  <span className="pin-icon">📍</span>
                  <span className="pin-text">Šetsanovac</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="map-details">
            <div className="detail-item">
              <span className="detail-label">
                <span className="detail-icon">📅</span>
                Datum
              </span>
              <span className="detail-value">{formatDate(currentDate)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">
                <span className="detail-icon">🕐</span>
                Vrijeme
              </span>
              <span className="detail-value">{formatTime(currentDate)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">
                <span className="detail-icon">📝</span>
                Opis
              </span>
              <span className="detail-value">Slike catering kod za DonMIju</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">
                <span className="detail-icon">⏰</span>
                Dostupno još
              </span>
              <span className="detail-value">
                <CountdownTimer />
              </span>
            </div>
          </div>
          
          <div className="map-footer">
            <div 
              className="service-badge enabled" 
              onClick={handleOpenFolder} 
              style={{ cursor: 'pointer' }}
            >
              <div className="button-content">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                  <path 
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Otvori Folder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringMap; 