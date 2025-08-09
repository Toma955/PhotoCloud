import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics';
import './styles/App.css';
import CateringMap from './components/CateringMap';
import BackgroundGallery from './components/BackgroundGallery';
import PhotosPage from './components/PhotosPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Check if we're on photos page
  useEffect(() => {
    if (window.location.pathname === '/photos') {
      setCurrentPage('photos');
    }
  }, []);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoaded(true), 1000);
    track('app_loaded');
  }, []);

  useEffect(() => {
    track('theme_changed', { theme });
  }, [theme]);

  return (
    <div className="app" data-theme={theme}>
      <style>
        {`
          :root {
            --apple-bg-primary: ${theme === 'dark' ? '#000000' : '#f5f5f7'};
            --apple-bg-secondary: ${theme === 'dark' ? '#1c1c1e' : '#ffffff'};
            --apple-bg-tertiary: ${theme === 'dark' ? '#2c2c2e' : '#f2f2f2'};
            --apple-text-primary: ${theme === 'dark' ? '#ffffff' : '#1d1d1f'};
            --apple-text-secondary: ${theme === 'dark' ? '#ebebf5' : '#86868b'};
            --apple-text-tertiary: ${theme === 'dark' ? '#ebebf599' : '#6e6e73'};
            --apple-accent: ${theme === 'dark' ? '#0a84ff' : '#007aff'};
            --apple-accent-hover: ${theme === 'dark' ? '#409cff' : '#0056cc'};
            --apple-border: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            --apple-border-light: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            --apple-shadow: ${theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)'};
            --apple-shadow-light: ${theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
          }
        `}
      </style>
      
      {currentPage === 'photos' ? (
        <PhotosPage onNavigateToHome={() => setCurrentPage('home')} />
      ) : (
        <>
          {/* Background Gallery */}
          <BackgroundGallery />
          
          {/* Main Content */}
          <div className={`main-content ${isLoaded ? 'loaded' : ''}`}>
            {/* Main Gallery */}
            <main className="app-main">
                          <div className="gallery-container">
              <CateringMap 
                theme={theme} 
                toggleTheme={toggleTheme} 
                onNavigateToPhotos={() => setCurrentPage('photos')}
              />
            </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App; 