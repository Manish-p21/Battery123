import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './header.js';

// Mock product data (fallback if API fails)
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
    category: 'Car Battery',
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
    category: 'Inverter Battery',
    capacity: '100Ah - 150Ah',
    slug: 'exide-inverter-battery',
  },
];

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

const Products1 = () => {
  const gridImageWidth = 'w-80';
  const gridImageHeight = 'h-80';
  const quickViewImageWidth = 'mx-28 w-80';
  const quickViewImageHeight = 'h-80';

  const navigate = useNavigate();
  const location = useLocation();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([2000, 10000]);
  const [brand, setBrand] = useState('All Brands');
  const [category, setCategory] = useState('All Types');
  const [capacity, setCapacity] = useState('All Capacities');
  const [brands, setBrands] = useState(['All Brands']);
  const [categories, setCategories] = useState(['All Types']);
  const [capacities, setCapacities] = useState(['All Capacities']);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Parse URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const minPrice = query.get('minPrice') ? Number(query.get('minPrice')) : 2000;
    const maxPrice = query.get('maxPrice') ? Number(query.get('maxPrice')) : 10000;
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
          axios.get('http://localhost:5000/api/brands'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/capacities'),
        ]);
        if (brandsRes.data.success) setBrands(brandsRes.data.data);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
        if (capacitiesRes.data.success) setCapacities(capacitiesRes.data.data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError(error.message);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch products with filters
  const fetchProducts = async (filters = {}) => {
    try {
      const params = {};
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      if (filters.brand && filters.brand !== 'All Brands') params.brand = filters.brand;
      if (filters.category && filters.category !== 'All Types') params.category = filters.category;
      if (filters.capacity && filters.capacity !== 'All Capacities') params.capacity = filters.capacity;

      const res = await axios.get('http://localhost:5000/api/batteries', { params });
      if (res.data.success) {
        setFilteredProducts(res.data.data || []);
        setAppliedFilters(res.data.appliedFilters || {});
      } else {
        throw new Error(res.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setFilteredProducts(mockProducts);
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
    if (priceRange[0] !== 2000) params.set('minPrice', priceRange[0]);
    if (priceRange[1] !== 10000) params.set('maxPrice', priceRange[1]);
    if (brand !== 'All Brands') params.set('brand', brand);
    if (category !== 'All Types') params.set('category', category);
    if (capacity !== 'All Capacities') params.set('capacity', capacity);
    navigate(`/Product?${params.toString()}`, { replace: true });
  }, [priceRange, brand, category, capacity, navigate]);

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
    setPriceRange([2000, 10000]);
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
    <div className="font-poppins bg-white w-full min-h-screen">
      <Header />
      <div className="bg-gray-50 py-6 border-b">
        <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="text-gray-600 mt-2">
            Discover our curated selection of products tailored to your needs
          </p>
          
        </div>
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="grid grid-cols-7 gap-0">
          <div className="col-span-7 md:col-span-2">
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
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Price Range</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="2000"
                          max="10000"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([Number(e.target.value), priceRange[1]])
                          }
                          className="w-full accent-green-600"
                          aria-label="Minimum price"
                        />
                        <input
                          type="range"
                          min="2000"
                          max="10000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([priceRange[0], Number(e.target.value)])
                          }
                          className="w-full accent-green-600"
                          aria-label="Maximum price"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹2,000</span>
                        <span>₹5,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      aria-label="Battery brand"
                    >
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      aria-label="Battery category"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      aria-label="Battery capacity"
                    >
                      {capacities.map((cap) => (
                        <option key={cap} value={cap}>
                          {cap}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleApplyFilters}
                      className="w-full sm:flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300"
                      aria-label="Apply filters"
                    >
                      Apply Filters
                    </button>
                    {!isMobile && (
                      <button
                        onClick={handleResetFilters}
                        className="w-full sm:flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition duration-300"
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
          <div className="col-span-7 md:col-span-5">
            <section className="bg-white font-poppins">
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                  Featured Batteries & Chargers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-600 text-center col-span-full">No products found</p>
                  ) : (
                    filteredProducts.slice(0, 500).map((product, index) => (
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
                            src={product.image || '/placeholder.jpg'}
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
            <div className={`relative ${quickViewImageHeight} mb-6 overflow-hidden rounded-lg`}>
              <img
                src={selectedProduct.image || '/placeholder.jpg'}
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

StarRating.propTypes = {
  rating: PropTypes.number,
};

Products1.propTypes = {};

export default Products1;