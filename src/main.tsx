import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Register push notification service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/push-sw.js').then(registration => {
      console.log('Push Service Worker registered:', registration);
    }).catch(error => {
      console.error('Push Service Worker registration failed:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
