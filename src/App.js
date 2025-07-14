import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Battery from './pages/battery.js';
import ProductDescriptionPage from './components/battery/ProductDescriptionPage.jsx';
import About from './components/battery/about.js';
import Cart from './components/battery/cart.js';
import Products1 from './components/battery/products1.js';
import Footer from './components/battery/Footer.jsx'; // Import the Footer component

function AppContent() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col items-center bg-gray-900 text-white">
      <main className="w-full flex flex-col items-center">
        <Routes>
          <Route path="/" element={<Battery />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Product" element={<Products1 />} />
          <Route path="/product/:slug" element={<ProductDescriptionPage />} />
        </Routes>
      </main>
      <Footer /> {/* Add Footer to render on every page */}
    </div>
  );
}

function App() {
  return (
    <>
      <AppContent />
    </>
  );
}

export default App;