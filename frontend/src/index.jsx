import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// Remove loader if exists
const loader = document.getElementById('loader');
if (loader) {
  loader.parentNode.removeChild(loader);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
