import React from 'react';
import './Spinner.css'

function Spinner() {
  return (
    <div style={{ width: '60px', margin: 'auto', display: 'block' }}>
      <div className="spinner-container">
          <div className="loading-spinner"></div>
    </div>
  </div>
  );
};

export default Spinner;