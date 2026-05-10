import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';

import reportWebVitals from './reportWebVitals';

import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(

  <React.StrictMode>

    <Toaster

      position="top-right"

      toastOptions={{

        duration: 3000,

        style: {

          background: '#111827',

          color: '#fff',

          borderRadius: '16px',

          padding: '14px 18px',

          fontSize: '14px',

          fontWeight: '600',
        },

        success: {

          iconTheme: {

            primary: '#f97316',

            secondary: '#fff',
          },
        },

        error: {

          iconTheme: {

            primary: '#ef4444',

            secondary: '#fff',
          },
        },
      }}
    />

    <App />

  </React.StrictMode>
);

reportWebVitals();