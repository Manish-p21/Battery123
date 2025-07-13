import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from './header.js';

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

const ProductDescriptionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  // Adjustable image dimensions
  const imageWidth = 'w-[500px] mx-80'; // Adjust this Tailwind class (e.g., 'w-96', 'w-[500px]', or 'w-full')
  const imageHeight = 'h-[500px]'; // Adjust this Tailwind class (e.g., 'h-96', 'h-[600px]', or 'h-[500px]')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          throw new Error(res.data.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-poppins">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-poppins">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={() => navigate('/')}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-white font-poppins pt-12 pb-40">
      <Header />
      <div className="w-full mx-auto px-4 pt-10 sm:px-6 lg:px-40">
        <nav className="mb-6">
          <button
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
            onClick={() => navigate('/')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className={`relative ${imageHeight} mb-8 overflow-hidden rounded-2xl shadow-lg group`}>
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name || 'Product'}
                className={`${imageWidth} ${imageHeight} object-cover transform group-hover:scale-110 transition-transform duration-500`}
                loading="lazy"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                {['specifications', 'reviews', 'faqs'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-6 animate-zoomIn">
                {activeTab === 'specifications' && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    {(product.specifications?.length || 0) > 0 ? (
                      <table className="w-full text-left">
                        <tbody>
                          {product.specifications.map((spec, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="text-gray-600 py-3 px-4 font-semibold">{spec.label}</td>
                              <td className="text-gray-800 py-3 px-4">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600">No specifications available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {(product.reviews?.length || 0) > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-center mb-2">
                            <StarRating rating={review.rating || 0} />
                            <span className="ml-2 text-sm text-gray-500">({review.rating || 0})</span>
                          </div>
                          <p className="text-gray-600 mb-2">{review.comment || 'No comment'}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{review.author || 'Anonymous'}</span>
                            <span>{review.date || 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No reviews available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    {(product.faqs?.length || 0) > 0 ? (
                      product.faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-lg">
                          <button
                            className="w-full text-left p-4 flex justify-between items-center text-gray-800 font-semibold"
                            onClick={() => toggleFaq(index)}
                          >
                            <span>{faq.question || 'No question'}</span>
                            <svg
                              className={`w-5 h-5 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openFaq === index && (
                            <div className="p-4 pt-0 text-gray-600 animate-zoomIn">{faq.answer || 'No answer'}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No FAQs available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description || 'No description'}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name || 'Unnamed Product'}</h1>
              <div className="flex items-center mb-3">
                <StarRating rating={product.rating || 0} />
                <span className="ml-2 text-sm text-gray-500">({product.rating || 0})</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-4">
                ₹{product.price ? (product.price * quantity).toFixed(2) : 'N/A'}
              </p>
              <div className="mb-4 text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
                  Free Shipping on orders over ₹50
                </span>
              </div>
              <div className="flex items-center mb-4">
                <button
                  className="bg-gray-200 text-gray-800 w-8 h-8 rounded-l-lg hover:bg-gray-300"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="text-gray-800 font-semibold w-12 text-center">{quantity}</span>
                <button
                  className="bg-gray-200 text-gray-800 w-8 h-8 rounded-r-lg hover:bg-gray-300"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 shadow-md mb-3">
                Add to Cart
              </button>
              <button
                className="w-full border-2 border-green-600 text-green-600 font-semibold py-3 rounded-lg hover:bg-green-600/10"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionPage.propTypes = {};
export default ProductDescriptionPage;