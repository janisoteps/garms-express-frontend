// // index.jsx
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import { CookiesProvider } from 'react-cookie';

render((
  <CookiesProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CookiesProvider>
), document.getElementById('content'));
