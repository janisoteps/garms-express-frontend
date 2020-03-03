// // index.jsx
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/main/App';
import { CookiesProvider } from 'react-cookie';
import registerServiceWorker from './registerServiceWorker';

render((
  <CookiesProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CookiesProvider>
), document.getElementById('content'));

registerServiceWorker();
