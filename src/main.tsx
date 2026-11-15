import './utils/polyfills';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Restore SPA target route from 404.html redirect query/session parameter before React Router boots
if (typeof window !== 'undefined') {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTarget = searchParams.get('redirect') || sessionStorage.getItem('hrmatrix_spa_redirect');
    if (redirectTarget) {
      sessionStorage.removeItem('hrmatrix_spa_redirect');
      const cleanTarget = decodeURIComponent(redirectTarget);
      if (cleanTarget && cleanTarget !== '/' && !cleanTarget.startsWith('/?redirect')) {
        window.history.replaceState(null, '', cleanTarget);
      }
    }
  } catch {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
