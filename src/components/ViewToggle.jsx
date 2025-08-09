import React from 'react';
import './ViewToggle.css';

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        aria-pressed={viewMode === 'grid'}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      
      <button
        className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="2" y="7.5" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="2" y="13" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle; 