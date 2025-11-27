import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Import Global CSS
import './index.css';

// 2. Import Bootstrap CSS (for styling)
import 'bootstrap/dist/css/bootstrap.min.css';

// 3. IMPORTANT FIX: Import Bootstrap JavaScript bundle.
// This line is CRITICAL for making the mobile menu and Carousel work.
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
