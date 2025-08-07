import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Utility function to convert Google Drive view link to direct image URL
const getGoogleDriveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '/placeholder.jpg';
  const match = url.match(/\/file\/d\/(.+?)\/view/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url.includes('drive.google.com') ? '/placeholder.jpg' : url;
};

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

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (query) params.search = query;
        if (category) params.category = category;
        if (brand) params.brand = brand;

        const res = await axios.get('https://battery-api-6an6.onrender.com/api/batteries', { params });
        if (res.data.success) {
          setProducts(res.data.data || []);
        } else {
          throw new Error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category, brand]);

  const handleFilter = (type, value) => {
    const params = new URLSearchParams();
    if (type === 'category') {
      params.set('category', value);
    } else if (type === 'brand') {
      params.set('brand', value);
    } else if (type === 'search') {
      params.set('query', value);
    }
    navigate(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2">Loading search results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">No Results Found</h2>
          <p className="text-gray-400">No products match "{query || category || brand || 'your search'}". Try adjusting your search terms.</p>
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
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-green-600 mb-6 text-center">
          Search Results for "{query || category || brand || 'All Products'}"
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <select
            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
          <input
            type="text"
            placeholder="Search within results..."
            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={query}
            onChange={(e) => handleFilter('search', e.target.value)}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id.$oid || product.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={getGoogleDriveImageUrl(product.image)}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
                loading="lazy"
              />
              <div className="p-2">
                <h3 className="text-lg font-semibold text-white mt-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                <p className="text-green-500 font-bold mb-2">₹{product.price?.toFixed(2) || 'N/A'}</p>
                <div className="flex items-center mb-2">
                  <StarRating rating={product.rating || 0} />
                  <span className="ml-2 text-gray-300 text-sm">({product.rating || 0})</span>
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