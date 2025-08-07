import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Utility function to convert Google Drive view link to direct image URL
const getGoogleDriveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '/placeholder.jpg';
  const match = url.match(/\/file\/d\/(.+?)\/view/);
  return match && match[1] ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url.includes('drive.google.com') ? '/placeholder.jpg' : url;
};

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.618 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.356-2.44a1 1 0 00-1.175 0l-3.356 2.44c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.945 9.397c-.753-.57-.351-1.81.618-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
    </svg>
  ));
  return <div className="flex">{stars}</div>;
};

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery); // Local search term for in-page filtering

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (category) params.category = category;
        if (brand) params.brand = brand;

        const res = await axios.get('https://battery-api-6an6.onrender.com/api/batteries', { params });
        if (res.data.success) {
          const fetchedProducts = res.data.data || [];
          setAllProducts(fetchedProducts);
          applyFilters(fetchedProducts);
        } else {
          throw new Error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, brand]);

  const applyFilters = (productsToFilter) => {
    let filtered = [...productsToFilter];
    if (category) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setProducts(filtered);
  };

  // Debounce search term update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      applyFilters(allProducts);
    }, 300); // Wait 300ms after typing stops
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, allProducts]);

  const handleFilter = (type, value) => {
    const params = new URLSearchParams();
    if (type === 'category') params.set('category', value);
    else if (type === 'brand') params.set('brand', value);
    else if (type === 'search') {
      params.set('query', value);
      setSearchTerm(value); // Update searchTerm without immediate navigation
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // Update searchTerm locally
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-800">Loading search results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center p-6 bg-gray-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-800">{error}</p>
          <button
            className="mt-4 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => navigate('/search')}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center p-6 bg-gray-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Results Found</h2>
          <p className="text-gray-800">No products match "{searchTerm || category || brand || 'your search'}". Try different terms.</p>
          <button
            className="mt-4 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-20 pt-28">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-600 mb-6 text-left">
          Search Results for "{searchTerm || category || brand || 'All Products'}"
        </h1>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap justify-between items-center">
        {/* Left Filters */}
        <div className="flex gap-4 flex-wrap">
            <select
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e) => handleFilter('category', e.target.value)}
            value={category || ''}
            >
            <option value="">All Categories</option>
            <option value="Chargers">Chargers</option>
            <option value="Batteries">Batteries</option>
            <option value="Inverters">Inverters</option>
            <option value="UPS">UPS</option>
            <option value="Solar">Solar</option>
            </select>

            <select
            className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e) => handleFilter('brand', e.target.value)}
            value={brand || ''}
            >
            <option value="">All Brands</option>
            <option value="Microtek">Microtek</option>
            <option value="Amaron">Amaron</option>
            <option value="Exide">Exide</option>
            <option value="Livguard">Livguard</option>
            <option value="Luminous">Luminous</option>
            <option value="Tata">Tata</option>
            </select>
        </div>

        {/* Search Box aligned to right */}
        <input
            type="text"
            placeholder="Search products..."
            className="w-96 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
        />
        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id.$oid || product.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="w-full h-48 flex items-center justify-center bg-white">
                <img
                  src={getGoogleDriveImageUrl(product.image)}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-800 mt-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">{product.description}</p>
                <p className="text-green-600 font-bold mb-2">₹{product.price?.toFixed(2) || 'N/A'}</p>
                <div className="flex items-center mb-2">
                  <StarRating rating={product.rating || 0} />
                  <span className="ml-2 text-gray-600 text-sm">({product.rating || 0})</span>
                </div>
                <button
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;