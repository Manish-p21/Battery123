import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-3 h-3 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
  const gridImageWidth = 'w-80 mx-auto';
  const gridImageHeight = 'h-80';
  const quickViewImageWidth = 'w-96 mx-auto';
  const quickViewImageHeight = 'h-96';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Batteries', 'Chargers', 'Inverters', 'UPS', 'Solar']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get category from URL query parameter
  const query = new URLSearchParams(location.search);
  const selectedCategory = query.get('category') || '';
  // Capitalize category to match API data
  const formattedCategory = selectedCategory
    ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
    : '';

  // Mock products for fallback
  const mockProducts = [
    {
      _id: '1',
      name: 'Amaron Car Battery',
      price: 3500,
      rating: 4.5,
      description: 'High-performance car battery with long lifespan.',
      image: '/amaron-car-battery.jpg',
      isBestSeller: true,
      brand: 'Amaron',
      category: 'Batteries',
      capacity: '50Ah - 100Ah',
      slug: 'amaron-car-battery',
    },
    {
      _id: '2',
      name: 'Exide Inverter Battery',
      price: 4500,
      rating: 4.0,
      description: 'Reliable inverter battery for uninterrupted power.',
      image: '/exide-inverter-battery.jpg',
      isBestSeller: false,
      brand: 'Exide',
      category: 'Inverters',
      capacity: '100Ah - 150Ah',
      slug: 'exide-inverter-battery',
    },
    {
      _id: '3',
      name: 'Luminous UPS',
      price: 6000,
      rating: 4.2,
      description: 'Efficient UPS for home and office use.',
      image: '/luminous-ups.jpg',
      isBestSeller: false,
      brand: 'Luminous',
      category: 'UPS',
      capacity: '100Ah - 150Ah',
      slug: 'luminous-ups',
    },
    {
      _id: '4',
      name: 'Microtek Charger',
      price: 2500,
      rating: 4.0,
      description: 'Fast and reliable battery charger.',
      image: '/microtek-charger.jpg',
      isBestSeller: true,
      brand: 'Microtek',
      category: 'Chargers',
      capacity: 'N/A',
      slug: 'microtek-charger',
    },
    {
      _id: '5',
      name: 'Tata Solar Panel',
      price: 8000,
      rating: 4.3,
      description: 'High-efficiency solar panel for renewable energy.',
      image: '/tata-solar.jpg',
      isBestSeller: false,
      brand: 'Tata',
      category: 'Solar',
      capacity: 'N/A',
      slug: 'tata-solar',
    },
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://battery-api-6an6.onrender.com/api/categories');
        console.log('Fetched categories:', res.data);
        if (res.data.success) {
          setCategories(res.data.data || ['Batteries', 'Chargers', 'Inverters', 'UPS', 'Solar']);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = formattedCategory ? { category: formattedCategory } : {};
        console.log('Fetching products with params:', params);
        const res = await axios.get('https://battery-api-6an6.onrender.com/api/batteries', { params });
        console.log('API response:', res.data);
        if (res.data.success) {
          const fetchedProducts = res.data.data || [];
          setProducts(fetchedProducts.length > 0 ? fetchedProducts : mockProducts);
        } else {
          throw new Error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts(formattedCategory ? mockProducts.filter(product => product.category === formattedCategory) : mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [formattedCategory]);

  // Handle quick view modal
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center w-full justify-center font-poppins bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-16">
      <section className="pt-20 pb-8 font-poppins">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-left tracking-tight">
            Shop by Categories
          </h2>
          <div className="flex w-full border-b border-gray-200 py-6 flex-wrap justify-left gap-4">
            <button
              key="all"
              onClick={() => navigate('')}
              className={`px-4 py-2 border border-gray-200 font-medium rounded-xl transition-all duration-300 shadow-md ${
                !selectedCategory
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'bg-white text-gray-800 hover:bg-green-100 hover:text-gray-900'
              }`}
            >
              All Types
            </button>
            {categories
              .filter((cat) => cat !== 'All Types') // Prevent duplicate "All Types"
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`?category=${cat.toLowerCase()}`)}
                  className={`px-4 py-2 border border-gray-200 font-medium rounded-xl transition-all duration-300 shadow-md ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-white text-gray-800 hover:bg-green-100 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="py-5 font-poppins">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-24">
          
          {loading ? (
            <p className="text-gray-600 text-lg text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 text-lg text-center">
              No products found for {formattedCategory || 'All Types'}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 30).map((product, index) => (
                <div
                  key={product._id || index}
                  className="relative bg-white px-2 border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:scale-100 transition-all duration-500 transform"
                  style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s` }}
                  role="article"
                >
                  {product.isBestSeller && (
                    <span className="absolute top-4 left-4 z-20 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                  <div className={`relative ${gridImageHeight} mb-0 overflow-hidden rounded-lg bg-white`}>
                    <img
                      src={getGoogleDriveImageUrl(product.image) || '/placeholder.jpg'}
                      alt={product.name || 'Product'}
                      className={`${gridImageWidth} ${gridImageHeight} object-contain transition-transform duration-300 hover:scale-105`}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg px-2 font-semibold text-gray-900 mb-0">{product.name || 'Unnamed Product'}</h3>
                  <p className="text-gray-600 px-2 text-xs mb-4 line-clamp-2">{product.description || 'No description'}</p>
                  <p className="text-lg px-2 font-bold text-gray-900 mb-0">
                    ₹{product.price ? product.price.toFixed(2) : 'N/A'}
                  </p>
                  <div className="flex px-2 items-center mb-4">
                    <StarRating rating={product.rating || 0} />
                    <span className="ml-2 text-xs text-gray-500">({product.rating || 0})</span>
                  </div>
                  
                  <div className="flex pb-4 px-2 gap-4">
                    <button
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="flex-1 border-2 border-green-600 text-green-600 font-semibold py-2 rounded-lg hover:bg-green-50 transition duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-8 shadow-2xl transform transition-all duration-500 animate-slideInUp font-poppins relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={handleClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className={`relative ${quickViewImageHeight} mb-8 overflow-hidden rounded-lg`}>
              <img
                src={getGoogleDriveImageUrl(selectedProduct.image) || '/placeholder.jpg'}
                alt={selectedProduct.name || 'Product'}
                className={`${quickViewImageWidth} ${quickViewImageHeight} object-cover transition-transform duration-300 hover:scale-105`}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name || 'Unnamed Product'}</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={selectedProduct.rating || 0} />
              <span className="ml-2 text-sm text-gray-500">({selectedProduct.rating || 0})</span>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-4">
              ₹{selectedProduct.price ? selectedProduct.price.toFixed(2) : 'N/A'}
            </p>
            <hr className="border-gray-200 mb-6" />
            <p className="text-gray-600 mb-6 leading-relaxed">{selectedProduct.description || 'No description'}</p>
            <hr className="border-gray-200 mb-6" />
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
              >
                Add to Cart
              </button>
              <button
                className="flex-1 border-2 border-green-600 text-green-600 font-semibold py-3 rounded-lg hover:bg-green-50 transition duration-300"
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

StarRating.propTypes = {
  rating: PropTypes.number,
};

Hero1.propTypes = {};

export default Hero1;