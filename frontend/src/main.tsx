import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import i18n from './i18n.ts';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <SnackbarProvider maxSnack={4}>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </SnackbarProvider>
    </I18nextProvider>
  </StrictMode>
);
