import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Battery from './pages/battery.js';
import Header from './components/battery/header.js';
import ProductDescriptionPage from './components/battery/ProductDescriptionPage.jsx';
import About from './components/battery/about.js';
import Cart from './components/battery/cart.js';
import Products1 from './components/battery/products1.js';
import Footer from './components/battery/Footer.jsx'; // Import the Footer component
import SearchResults from './components/battery/SearchResults.js'; // Import the new SearchResults component

function AppContent() {
  return (
    <div className="relative flex flex-col items-center bg-gray-900 text-white ">
      {<Header />}
      <main className="w-full flex flex-col items-center">
        <Routes>
          <Route path="/" element={<Battery />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Product" element={<Products1 />} />
          <Route path="/product/:slug" element={<ProductDescriptionPage />} />
          <Route path="/search" element={<SearchResults />} /> {/* New route for search results */}
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