import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './header.js';

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

const SkeletonProduct = () => {
  const gridImageHeight = 'h-80';
  return (
    <div className="relative bg-white p-2 border border-gray-200 rounded-xl shadow-md animate-pulse">
      <div className={`relative ${gridImageHeight} mb-2 overflow-hidden rounded-lg bg-gray-200`}></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 mx-2"></div>
      <div className="border-t border-gray-200 mx-2 my-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 mx-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4 mx-2"></div>
      <div className="h-5 bg-gray-200 rounded w-24 mb-4 mx-2"></div>
      <div className="h-10 bg-gray-200 rounded-lg mx-2"></div>
    </div>
  );
};

const Products1 = () => {
  const gridImageWidth = 'w-80 mx-auto';
  const gridImageHeight = 'h-80';
  const quickViewImageWidth = 'mx-auto w-80';
  const quickViewImageHeight = 'h-80';

  const navigate = useNavigate();
  const location = useLocation();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([1000, 250000]);
  const [brand, setBrand] = useState('All Brands');
  const [category, setCategory] = useState('All Types');
  const [capacity, setCapacity] = useState('All Capacities');
  const [brands, setBrands] = useState(['All Brands']);
  const [categories, setCategories] = useState(['All Types']);
  const [capacities, setCapacities] = useState(['All Capacities']);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loading, setLoading] = useState(true);

  // Parse URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const minPrice = query.get('minPrice') ? Number(query.get('minPrice')) : 1000;
    const maxPrice = query.get('maxPrice') ? Number(query.get('maxPrice')) : 250000;
    const queryBrand = query.get('brand') || 'All Brands';
    const queryCategory = query.get('category') || 'All Types';
    const queryCapacity = query.get('capacity') || 'All Capacities';

    setPriceRange([minPrice, maxPrice]);
    setBrand(queryBrand);
    setCategory(queryCategory);
    setCapacity(queryCapacity);
  }, [location.search]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch brands, categories, and capacities on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes, categoriesRes, capacitiesRes] = await Promise.all([
          axios.get('https://battery-api-6an6.onrender.com/api/brands'),
          axios.get('https://battery-api-6an6.onrender.com/api/categories'),
          axios.get('https://battery-api-6an6.onrender.com/api/capacities'),
        ]);
        if (brandsRes.data.success) setBrands(brandsRes.data.data);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
        if (capacitiesRes.data.success) setCapacities(capacitiesRes.data.data.filter(cap => cap));
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError(error.message);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch products with filters
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.brand && filters.brand !== 'All Brands') params.brand = filters.brand;
      if (filters.category && filters.category !== 'All Types') params.category = filters.category;
      if (filters.capacity && filters.capacity !== 'All Capacities') params.capacity = filters.capacity;

      const res = await axios.get('https://battery-api-6an6.onrender.com/api/batteries', { params });
      if (res.data.success) {
        const data = res.data.data || [];
        const priceFiltered = data.filter(product => 
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        );
        setFilteredProducts(priceFiltered);
      } else {
        throw new Error(res.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    const filters = {
      priceRange,
      brand,
      category,
      capacity,
    };
    fetchProducts(filters);

    // Update URL with current filters
    const params = new URLSearchParams();
    if (priceRange[0] !== 1000) params.set('minPrice', priceRange[0]);
    if (priceRange[1] !== 250000) params.set('maxPrice', priceRange[1]);
    if (brand !== 'All Brands') params.set('brand', brand);
    if (category !== 'All Types') params.set('category', category);
    if (capacity !== 'All Capacities') params.set('capacity', capacity);
    navigate(`/Product?${params.toString()}`, { replace: true });
  }, [priceRange, brand, category, capacity, navigate]);;

  // Handle filter application
  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      brand,
      category,
      capacity,
    };
    fetchProducts(filters);
  };

  // Reset filters to default
  const handleResetFilters = () => {
    setPriceRange([1000, 250000]);
    setBrand('All Brands');
    setCategory('All Types');
    setCapacity('All Capacities');
    navigate('/Product', { replace: true });
  };

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
      <div className="min-h-screen flex items-center w-full bg-gray-50 justify-center font-poppins">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins bg-gray-50 w-full min-h-screen">
      <Header />
      <div className="bg-gray-50 py-6 border-b">
        <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="text-gray-600 mt-2">
            Discover our curated selection of products tailored to your needs
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          <div className="col-span-1 md:col-span-2">
            <section className="py-8 text-black">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Filter</h2>
                  {isMobile && (
                    <button
                      onClick={handleResetFilters}
                      className="text-blue-600 font-semibold hover:text-blue-800"
                      aria-label="Reset all filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="bg-white p-6 rounded-lg border grid gap-6 grid-cols-1 auto-rows-auto">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Price Range</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1000"
                          max="250000"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const newMin = Number(e.target.value);
                            if (newMin <= priceRange[1]) {
                              setPriceRange([newMin, priceRange[1]]);
                            }
                          }}
                          className="w-full accent-red-600"
                          aria-label="Minimum price"
                        />
                        <input
                          type="range"
                          min="1000"
                          max="250000"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const newMax = Number(e.target.value);
                            if (newMax >= priceRange[0]) {
                              setPriceRange([priceRange[0], newMax]);
                            }
                          }}
                          className="w-full accent-red-600"
                          aria-label="Maximum price"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹1,000</span>
                        <span>₹250,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      aria-label="Battery brand"
                    >
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      aria-label="Battery category"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      aria-label="Battery capacity"
                    >
                      {capacities.map((cap) => (
                        <option key={cap} value={cap}>
                          {cap}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleApplyFilters}
                      className="w-full sm:flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                      aria-label="Apply filters"
                    >
                      Apply Filters
                    </button>
                    {!isMobile && (
                      <button
                        onClick={handleResetFilters}
                        className="w-full sm:flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition duration-300 shadow-md"
                        aria-label="Reset all filters"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="col-span-1 md:col-span-5">
            <section className="bg-gray-50 font-poppins">
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-left tracking-tight">
                  Featured Batteries & Chargers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonProduct key={index} />
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-600 text-lg text-center col-span-full">No products found</p>
                  ) : (
                    filteredProducts.slice(0, 500).map((product, index) => (
                      <div
                        key={product._id || index}
                        style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s` }}
                        role="article"
                      >
                        <p className="text-sm text-gray-500 mb-2 px-2">{product.category || 'No Category'}</p>
                        <div className="relative bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:scale-100 transition-all duration-500 transform p-2">
                          {product.isBestSeller && (
                            <span className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Best Seller
                            </span>
                          )}
                          <div className={`relative ${gridImageHeight} mb-2 overflow-hidden rounded-lg bg-white`}>
                            <img
                              src={getGoogleDriveImageUrl(product.image) || '/placeholder.jpg'}
                              alt={product.name || 'Product'}
                              className={`${gridImageWidth} ${gridImageHeight} object-contain transition-transform duration-300 hover:scale-105`}
                              loading="lazy"
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 px-2">
                            {(product.name?.length > 30)
                              ? product.name.slice(0, 30) + "..."
                              : product.name || "Unnamed Product"}
                          </h3>
                          <div className="border-t border-gray-200 mx-2 my-2"></div>
                          <p className="text-lg font-bold text-gray-900 mb-2 px-2">
                            ₹{product.price ? product.price.toLocaleString("en-IN") : 'N/A'}
                          </p>
                          <p className="text-gray-600 text-xs mb-4 px-2 line-clamp-2">
                            {product.shortDescription || product.description || 'No description'}
                          </p>
                          <div className="flex items-center mb-4 px-2">
                            <StarRating rating={product.rating || 0} />
                            <span className="ml-2 text-xs text-gray-500">({product.rating || 0})</span>
                          </div>
                          <button
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 shadow-md"
                            onClick={() => navigate(`/product/${product.slug || ''}`)}
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
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
            <div className={`relative ${quickViewImageHeight} mb-6 overflow-hidden rounded-lg bg-white`}>
              <img
                src={getGoogleDriveImageUrl(selectedProduct.image) || '/placeholder.jpg'}
                alt={selectedProduct.name || 'Product'}
                className={`${quickViewImageWidth} ${quickViewImageHeight} object-contain`}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name || 'Unnamed Product'}</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={selectedProduct.rating || 0} />
              <span className="ml-2 text-sm text-gray-500">({selectedProduct.rating || 0})</span>
            </div>
            <p className="text-xl font-bold text-gray-800 mb-4">
              ₹{selectedProduct.price ? selectedProduct.price.toLocaleString("en-IN") : 'N/A'}
            </p>
            <hr className="border-gray-200 mb-4" />
            <p className="text-gray-600 mb-6">{selectedProduct.shortDescription || selectedProduct.description || 'No description'}</p>
            <hr className="border-gray-200 mb-6" />
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 shadow-md"
              >
                Add to Cart
              </button>
              <button
                className="flex-1 text-center bg-white border-2 border-red-600 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-600/10 transition duration-300 shadow-md"
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

Products1.propTypes = {};

export default Products1;