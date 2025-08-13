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
  // Adjustable image dimensions for grid
  const gridImageWidth = 'w-80 mx-auto';
  const gridImageHeight = 'h-80';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get category from URL query parameter
  const query = new URLSearchParams(location.search);
  const selectedCategory = query.get('category') || '';
  // Convert URL param to match API category (e.g., 'ups-batteries' to 'UPS Batteries')
  const formattedCategory = selectedCategory
    ? selectedCategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim()
    : '';

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://battery-api-6an6.onrender.com/api/categories');
        console.log('Fetched categories:', res.data.data); // Debugging
        if (res.data.success && res.data.data) {
          setCategories(res.data.data);
        } else {
          console.warn('No categories returned, using fallback');
          setCategories(['Batteries', 'Chargers', 'Inverters', 'UPS Batteries', 'Solar Batteries', 'E-Rickshaw Batteries']);
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setCategories(['Batteries', 'Chargers', 'Inverters', 'UPS Batteries', 'Solar Batteries', 'E-Rickshaw Batteries']);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Use category query parameter only if a category is selected
        const params = formattedCategory ? { category: formattedCategory } : {};
        console.log('Fetching products with params:', params); // Debugging
        const res = await axios.get('https://battery-api-6an6.onrender.com/api/batteries', { params });
        console.log('API product response:', res.data); // Debugging
        if (res.data.success && res.data.data) {
          const fetchedProducts = res.data.data;
          // Filter products by category on the client side as a fallback
          const filteredProducts = formattedCategory
            ? fetchedProducts.filter(product => {
                const productCategory = product.category?.trim();
                console.log(`Comparing product category "${productCategory}" with selected "${formattedCategory}"`); // Debugging
                return productCategory === formattedCategory;
              })
            : fetchedProducts;
          console.log('Filtered products:', filteredProducts); // Debugging
          setProducts(filteredProducts);
        } else {
          throw new Error(res.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [formattedCategory]);

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
              .filter((cat) => cat !== 'All Types')
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`?category=${cat.toLowerCase().replace(/\s+/g, '-')}`)}
                  className={`px-4 py-2 border border-gray-200 font-medium rounded-xl transition-all duration-300 shadow-md ${
                    formattedCategory === cat
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
              {products.slice(0, 30).map((product, index) => (
                <div key={product._id || index} style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s` }}>
                  

                  <p className="text-sm text-gray-500 mb-2 px-2">{product.category || 'No Category'}</p>
                  <div className="relative bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:scale-100 transition-all duration-500 transform p-2">
                    {product.isBestSeller && (
                      <span className="absolute top-4 left-4 z-20 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
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
                      ₹
                      {product.price
                        ? product.price.toLocaleString("en-IN")
                        : "N/A"}
                    </p>

                    <p className="text-gray-600 text-xs mb-4 px-2 line-clamp-2">{product.shortDescription || 'No description'}</p>
                    <div className="flex items-center mb-4 px-2">
                      <StarRating rating={product.rating || 0} />
                      <span className="ml-2 text-xs text-gray-500">({product.rating || 0})</span>
                    </div>
                    <button
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
                      onClick={() => navigate(`/product/${product.slug || ''}`)}
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
};

Hero1.propTypes = {};

export default Hero1;