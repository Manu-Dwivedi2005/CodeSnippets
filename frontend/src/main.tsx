import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Bootstrap CSS (if you haven't already)
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your GLOBAL theme styles. This should be the source of truth for theming.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);