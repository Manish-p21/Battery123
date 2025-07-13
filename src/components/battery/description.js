import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import products from './products.js';
import Header from './header.js';

// Star rating component
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

// Description component for product popup
const Description = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  // Handle modal close
  const handleClose = () => {
    navigate('/');
  };

  // Handle clicks outside modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!product) {
    return <div className="text-center py-16">Product not found</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details for ${product.name}`}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-6 shadow-xl animate-slideUp font-poppins relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={handleClose}
          aria-label="Close product details"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image */}
        <div className="h-64 mb-6 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <div className="flex items-center mb-4">
          <StarRating rating={product.rating} />
          <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
        </div>
        <p className="text-xl font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
        <hr className="border-gray-200 mb-4" />
        <p className="text-gray-600 mb-6">{product.description}</p>
        <hr className="border-gray-200 mb-6" />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
          <Link
            to={`/product/battery/${product.id}`}
            className="flex-1 text-center border-2 border-green-600 text-green-600 font-semibold py-3 rounded-lg hover:bg-green-600/10 transition duration-300"
            aria-label={`View full details for ${product.name}`}
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type-checking
Description.propTypes = {
  // No props passed directly, uses useParams
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default Description;