import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './redux/store.ts';

window.axios = axios

window.axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`
window.axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
