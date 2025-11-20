import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from './context/CartContext.jsx';
import { FeedbackProvider } from './context/FeedbackContext.jsx'; 
import { WishlistProvider } from './context/WishlistContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <FeedbackProvider>
          {}
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </FeedbackProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);