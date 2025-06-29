import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppLoader from './AppLoader';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <AppLoader />
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
