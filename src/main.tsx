import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { PWAInstaller } from './components/PWAInstaller.tsx';
import './index.css';

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({
        onNeedRefresh() {
          if (confirm('New content available, reload?')) {
            window.location.reload();
          }
        },
        onOfflineReady() {
          console.log('App ready to work offline');
        }
      });
    });
  });
}

// Send telemetry
const sendPageView = (path: string) => {
  if (import.meta.env.PROD && navigator.sendBeacon) {
    navigator.sendBeacon(
      `${import.meta.env.VITE_API_BASE_URL}/metrics`,
      JSON.stringify({ 
        type: 'pageview', 
        path, 
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 200)
      })
    );
  }
};

// Track initial page load
sendPageView(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #475569'
            }
          }}
        />
        <PWAInstaller />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);