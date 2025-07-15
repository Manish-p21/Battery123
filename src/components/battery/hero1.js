import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.618 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.356-2.44a1 1 0 00-1.175 0l-3.356 2.44c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.945 9.397c-.753-.57-.351-1.81.618-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
    </svg>
  ));
  return <div className="flex">{stars}</div>;
};

// Utility function to convert Google Drive view link to direct image URL
const getGoogleDriveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '/placeholder.jpg';
  const match = url.match(/\/file\/d\/(.+?)\/view/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url.includes('drive.google.com') ? '/placeholder.jpg' : url;
};

const Hero1 = () => {
  // Adjustable image dimensions for grid and quick view
  const gridImageWidth = 'w-80 mx-5'; // Adjust this Tailwind class (e.g., 'w-48', 'w-64', or custom value like 'w-[300px]')
  const gridImageHeight = 'h-80'; // Adjust this Tailwind class (e.g., 'h-48', 'h-64', or custom value like 'h-[300px]')
  const quickViewImageWidth = 'w-80 mx-28'; // Adjust this Tailwind class (e.g., 'w-64', 'w-96', or custom value like 'w-[400px]')
  const quickViewImageHeight = 'h-80'; // Adjust this Tailwind class (e.g., 'h-64', 'h-80', or custom value like 'h-[400px]')

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setSelectedProduct(null);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedProduct) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/batteries');
        if (res.data.success) {
          setProducts(res.data.data || []);
        } else {
          throw new Error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="pt-16 pb-4 bg-white font-poppins">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-40">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Shop by Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {['batteries', 'chargers', 'inverters', 'ups', 'solar'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/batteries?category=${cat}`)}
                className="px-10 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 shadow-md capitalize"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white font-poppins">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-40">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Featured Batteries & Chargers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-600 text-center col-span-full">Loading products...</p>
            ) : (
              products.slice(0, 30).map((product, index) => (
                <div
                  key={product._id || index}
                  className="relative bg-white p-6 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  role="article"
                >
                  {product.isBestSeller && (
                    <span className="absolute top-4 left-4 z-20 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                  <div className={`relative ${gridImageHeight} mb-4 overflow-hidden rounded-lg`}>
                    <img
                      src={getGoogleDriveImageUrl(product.image) || '/placeholder.jpg'}
                      alt={product.name || 'Product'}
                      className={`${gridImageWidth} ${gridImageHeight} object-cover`}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name || 'Unnamed Product'}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'No description'}</p>
                  <div className="flex items-center mb-3">
                    <StarRating rating={product.rating || 0} />
                    <span className="ml-2 text-sm text-gray-500">({product.rating || 0})</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mb-4">
                    ₹{product.price ? product.price.toFixed(2) : 'N/A'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 text-center bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="flex-1 text-center border-2 border-green-600 text-green-600 font-semibold py-2 rounded-lg hover:bg-green-600/10 transition duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-2xl max-w-xl w-full mx-4 p-6 shadow-xl animate-slideUp font-poppins relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={handleClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className={`relative ${quickViewImageHeight} mb-6 overflow-hidden rounded-lg`}>
              <img
                src={getGoogleDriveImageUrl(selectedProduct.image) || '/placeholder.jpg'}
                alt={selectedProduct.name || 'Product'}
                className={`${quickViewImageWidth} ${quickViewImageHeight} object-cover`}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name || 'Unnamed Product'}</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={selectedProduct.rating || 0} />
              <span className="ml-2 text-sm text-gray-500">({selectedProduct.rating || 0})</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              ₹{selectedProduct.price ? selectedProduct.price.toFixed(2) : 'N/A'}
            </p>
            <hr className="border-gray-200 mb-4" />
            <p className="text-gray-600 mb-6">{selectedProduct.description || 'No description'}</p>
            <hr className="border-gray-200 mb-6" />
            <div className="flex gap-4">
              <button
                className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                Add to Cart
              </button>
              <button
                className="flex-1 text-center border-2 border-green-600 text-green-600 font-semibold py-2 rounded-lg hover:bg-green-600/10 transition duration-300"
                onClick={() => navigate(`/product/${selectedProduct.slug || ''}`)}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Hero1.propTypes = {};
export default Hero1;