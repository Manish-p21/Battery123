import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from './header.js';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'} transition-colors duration-200`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.618 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.356-2.44a1 1 0 00-1.175 0l-3.356 2.44c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.945 9.397c-.753-.57-.351-1.81.618-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
    </svg>
  ));
  return <div className="flex gap-1">{stars}</div>;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <img
        src={product.image || '/placeholder.jpg'}
        alt={product.name || 'Product'}
        className="w-full h-48 object-cover rounded-t-xl"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name || 'Unnamed Product'}</h3>
        <div className="flex items-center my-2">
          <StarRating rating={product.rating || 0} />
          <span className="ml-2 text-sm text-gray-500">({product.rating || 0})</span>
        </div>
        <p className="text-xl font-bold text-gray-800">₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
      </div>
    </div>
  );
};

const ProductDescriptionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  // Adjusted image dimensions
  const imageWidth = 'w-[450px]';
  const imageHeight = 'h-[450px]';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://battery-api-6an6.onrender.com/api/product/${slug}`);
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

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`https://battery-api-6an6.onrender.com/api/products/recommended/${slug}`);
        if (res.data.success) {
          setRecommendedProducts(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };

    fetchProduct();
    fetchRecommendations();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 font-poppins">
        <div className="text-2xl font-semibold text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center font-poppins">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Product Not Found</h2>
          <button
            className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
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

  // Flatten technicalSpecifications for display
  const flattenSpecifications = (specs) => {
    if (!specs) return [];
    const result = [];
    const addSpec = (key, value) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          result.push({ label: `${key} ${subKey}`, value: subValue });
        });
      } else {
        result.push({ label: key, value });
      }
    };
    Object.entries(specs).forEach(([key, value]) => addSpec(key, value));
    return result;
  };

  const specifications = flattenSpecifications(product.technicalSpecifications);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 font-poppins pt-16 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <nav className="mb-8">
          <button
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center transition-colors duration-200"
            onClick={() => navigate('/')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          <div className="lg:col-span-7">
            <div className={`relative ${imageHeight} mb-10 overflow-hidden rounded-3xl shadow-md group bg-white border border-gray-100`}>
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name || 'Product'}
                className={`${imageWidth} ${imageHeight} object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out mx-auto rounded-3xl`}
                loading="lazy"
              />
              {product.isBestSeller && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                  Best Seller
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="mb-10">
              <div className="flex border-b border-gray-200 bg-white rounded-t-2xl shadow-md">
                {['specifications', 'reviews', 'faqs'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-3 px-6 text-base font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-6 bg-white rounded-b-2xl shadow-xl p-8 animate-fadeIn">
                {activeTab === 'specifications' && (
                  <div className="border border-gray-100 rounded-2xl p-6">
                    {specifications.length > 0 ? (
                      <table className="w-full text-left">
                        <tbody>
                          {specifications.map((spec, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="text-gray-600 py-4 px-6 font-semibold">{spec.label}</td>
                              <td className="text-gray-800 py-4 px-6">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-600 text-lg">No specifications available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {(product.reviews?.length || 0) > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center mb-3">
                            <StarRating rating={review.rating || 0} />
                            <span className="ml-3 text-sm text-gray-500 font-medium">({review.rating || 0})</span>
                          </div>
                          <p className="text-gray-600 mb-3 leading-relaxed">{review.comment || 'No comment'}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{review.author || 'Anonymous'}</span>
                            <span>{review.date || 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-lg">No reviews available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    {(product.faqs?.length || 0) > 0 ? (
                      product.faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <button
                            className="w-full text-left p-5 flex justify-between items-center text-gray-800 font-semibold text-lg"
                            onClick={() => toggleFaq(index)}
                          >
                            <span>{faq.question || 'No question'}</span>
                            <svg
                              className={`w-6 h-6 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openFaq === index && (
                            <div className="p-5 pt-0 text-gray-600 text-base leading-relaxed animate-fadeIn">{faq.answer || 'No answer'}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-lg">No FAQs available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-5">Product Description</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription || 'No description'}</p>
            </div>

            {recommendedProducts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Customers Also Bought</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((recProduct) => (
                    <ProductCard key={recProduct.slug} product={recProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="sticky top-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name || 'Unnamed Product'}</h1>
              <div className="flex items-center mb-4">
                <StarRating rating={product.rating || 0} />
                <span className="ml-3 text-base text-gray-500 font-medium">({product.rating || 0})</span>
              </div>
              <p className="text-2xl font-semibold text-gray-800 mb-2">
                ₹{product.price ? (product.price * quantity).toFixed(2) : 'N/A'}
              </p>
              <div className="mb-5 text-sm text-gray-600 space-y-2">
                {product.warrantyPeriod && (
                  <div>
                    <span className="font-semibold">Warranty:</span> {product.warrantyPeriod}
                  </div>
                )}
                {product.shippingInfo && (
                  <div>
                    <span className="font-semibold">Shipping:</span> {product.shippingInfo}
                  </div>
                )}
                {product.returnPolicy && (
                  <div>
                    <span className="font-semibold">Return Policy:</span> {product.returnPolicy}
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="font-semibold">Weight:</span> {product.weight}
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="font-semibold">Dimensions:</span> {product.dimensions}
                  </div>
                )}
              </div>
              <div className="flex items-center mb-5">
                <button
                  className="bg-gray-200 text-gray-800 w-10 h-10 rounded-l-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="text-gray-800 font-semibold w-16 text-center text-lg">{quantity}</span>
                <button
                  className="bg-gray-200 text-gray-800 w-10 h-10 rounded-r-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button className="w-full bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-4">
                Add to Cart
              </button>
              <button
                className="w-full border-2 border-red-600 text-red-600 font-semibold py-4 rounded-lg hover:bg-red-600/10 transition-colors duration-300 transform hover:scale-105"
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

ProductDescriptionPage.propTypes = {
  slug: PropTypes.string,
};

export default ProductDescriptionPage;