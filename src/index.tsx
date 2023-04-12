import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import config from './config';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

if (config.titlePrefix) {
  document.title = `${config.titlePrefix}${document.title}`;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router basename={'dnd-character-sheets'}>
    <App />
  </Router>
);
