import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.css';
import { AuthProvider } from './firebase/AuthContext';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);