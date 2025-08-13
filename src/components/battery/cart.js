import React, { useReducer, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import products from './products.js';
import Header from './header.js';

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <svg
      key={index}
      className={`w-4 h-4 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.618 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.356-2.44a1 1 0 00-1.175 0l-3.356 2.44c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.945 9.397c-.753-.57-.351-1.81.618-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
    </svg>
  ));
  return <div className="flex">{stars}</div>;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.productId]: {
            ...state.items[action.productId],
            ...action.payload,
          },
        },
      };
    case 'REMOVE_ITEM':
      const { [action.productId]: _, ...rest } = state.items;
      return { ...state, items: rest };
    case 'CLEAR_CART':
      return { ...state, items: {} };
    case 'SET_PROMO':
      return { ...state, promo: action.payload };
    default:
      return state;
  }
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: {},
    promo: '',
  });
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load cart and recently viewed from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '{}');
    const savedRecent = JSON.parse(localStorage.getItem('recentProducts') || '[]');
    
    // Initialize demo data if cart is empty
    if (Object.keys(savedCart).length === 0) {
      const demoCart = {
        1: { quantity: 2, notes: '', giftWrap: false }, // UltraMax Li-Ion Battery
        3: { quantity: 1, notes: 'Gift for friend', giftWrap: true }, // PowerCore 10,000mAh Bank
        6: { quantity: 1, notes: '', giftWrap: false }, // ThunderHub Multi-Port Charger
        8: { quantity: 3, notes: '', giftWrap: false }, // ProCharge Wireless Pad
      };
      dispatch({ type: 'SET_CART', payload: demoCart });
      localStorage.setItem('cart', JSON.stringify(demoCart));
    } else {
      dispatch({ type: 'SET_CART', payload: savedCart });
    }

    // Initialize demo recently viewed products
    if (savedRecent.length === 0) {
      const demoRecent = [2, 5, 7]; // QuickCharge, MegaVolt AA, SlimFit Power Bank
      setRecentlyViewed(demoRecent);
      localStorage.setItem('recentProducts', JSON.stringify(demoRecent));
    } else {
      setRecentlyViewed(savedRecent);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartState.items));
  }, [cartState.items]);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let giftWrapTotal = 0;
    for (const [productId, item] of Object.entries(cartState.items)) {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        subtotal += product.price * item.quantity;
        if (item.giftWrap) giftWrapTotal += 3 * item.quantity; // $3 per item
      }
    }
    const shippingCost = subtotal >= 100 ? 0 : 5; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    let discount = 0;
    if (cartState.promo === 'SAVE10') {
      discount = subtotal * 0.1; // 10% off
    } else if (cartState.promo === 'FREESHIP') {
      discount = shippingCost; // Free shipping
    }
    const total = subtotal + tax + giftWrapTotal + shippingCost - discount;
    return { subtotal, tax, shippingCost, giftWrapTotal, discount, total };
  };

  const { subtotal, tax, shippingCost, giftWrapTotal, discount, total } = calculateTotals();

  // Handle quantity change
  const handleQuantityChange = (productId, change) => {
    const currentItem = cartState.items[productId];
    const newQuantity = (currentItem.quantity || 0) + change;
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', productId });
    } else {
      dispatch({
        type: 'UPDATE_ITEM',
        productId,
        payload: { quantity: newQuantity },
      });
    }
  };

  // Handle gift wrap toggle
  const handleGiftWrapToggle = (productId) => {
    dispatch({
      type: 'UPDATE_ITEM',
      productId,
      payload: { giftWrap: !cartState.items[productId].giftWrap },
    });
  };

  // Handle notes change
  const handleNotesChange = (productId, notes) => {
    dispatch({
      type: 'UPDATE_ITEM',
      productId,
      payload: { notes },
    });
  };

  // Remove item
  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Apply promo code
  const applyPromo = () => {
    const validPromos = ['SAVE10', 'FREESHIP'];
    if (validPromos.includes(promoInput.toUpperCase())) {
      dispatch({ type: 'SET_PROMO', payload: promoInput.toUpperCase() });
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    alert('Checkout is a placeholder. Your order total is $' + total.toFixed(2));
  };

  // Progress bar for free shipping
  const progressPercentage = Math.min((subtotal / 100) * 100, 100);

  // Empty cart state
  if (Object.keys(cartState.items).length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-poppins animate-fadeIn">
        <Header />
        <div className="text-center max-w-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Explore our range of high-performance batteries and chargers!</p>
          <Link
            to="/"
            className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300"
            aria-label="Shop now"
          >
            Shop Now
          </Link>
          {/* Recommended Products */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300 animate-zoomIn"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    loading="lazy"
                  />
                  <h4 className="text-gray-800 font-semibold">{product.name}</h4>
                  <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
                  <StarRating rating={product.rating} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-28 bg-white font-poppins animate-fadeIn">
      {/* Header from About component */}
      <Header />
      
      {/* Original Sticky Header */}
      <header className="fixed top-0 z-20 w-[1708px] bg-white shadow-md mt-2 mx-40 rounded-2xl border border-gray-200 py-4">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-gray-800 text-2xl font-bold">A</Link>
            <span className="ml-4 text-gray-600">Cart ({Object.keys(cartState.items).length})</span>
          </div>
          <div className="text-gray-800 font-semibold">${total.toFixed(2)}</div>
        </div>
      </header>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-40 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
            aria-label="Back to shop"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </nav>

        {/* Cart Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {/* Free Shipping Progress */}
        <div className="mb-8">
          <p className="text-gray-600 mb-2">
            {subtotal >= 100
              ? 'Congratulations! You qualify for free shipping.'
              : `Spend $${(100 - subtotal).toFixed(2)} more for free shipping.`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              {Object.entries(cartState.items).map(([productId, item]) => {
                const product = products.find((p) => p.id === parseInt(productId));
                if (!product) return null;
                return (
                  <div
                    key={productId}
                    className="border-b border-gray-200 py-6 animate-zoomIn relative group"
                  >
                    <div className="flex items-start">
                      {/* Product Image */}
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg mr-4 hover:opacity-90 transition duration-200"
                          loading="lazy"
                        />
                      </Link>
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-red-600"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center mb-2">
                          <StarRating rating={product.rating} />
                          <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
                        </div>
                        <p className="text-gray-600 text-sm">${product.price.toFixed(2)} each</p>
                        {/* Quantity Selector */}
                        <div className="flex items-center mt-2">
                          <button
                            className="bg-gray-200 text-gray-800 w-8 h-8 rounded-l-lg hover:bg-gray-300 transition duration-200"
                            onClick={() => handleQuantityChange(productId, -1)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-gray-800 font-semibold w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="bg-gray-200 text-gray-800 w-8 h-8 rounded-r-lg hover:bg-gray-300 transition duration-200"
                            onClick={() => handleQuantityChange(productId, 1)}
                            aria-label={`Increase quantity of ${product.name}`}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        {/* Gift Wrap */}
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={item.giftWrap}
                            onChange={() => handleGiftWrapToggle(productId)}
                            className="mr-2 accent-red-600"
                            aria-label={`Toggle gift wrap for ${product.name}`}
                          />
                          <span className="text-gray-600 text-sm">Gift Wrap ($3/item)</span>
                        </label>
                        {/* Notes */}
                        <textarea
                          className="w-full mt-2 p-2 border border-gray-200 rounded-lg text-sm text-gray-600 resize-none focus:ring-red-600 focus:border-red-600"
                          rows="2"
                          placeholder="Add notes (e.g., gift message)"
                          value={item.notes}
                          onChange={(e) => handleNotesChange(productId, e.target.value)}
                          aria-label={`Notes for ${product.name}`}
                        />
                      </div>
                      {/* Subtotal and Remove */}
                      <div className="text-right">
                        <p className="text-gray-800 font-semibold">
                          ${(product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="text-red-600 text-sm hover:text-red-800 mt-2 relative group"
                          onClick={() => removeItem(productId)}
                          aria-label={`Remove ${product.name} from cart`}
                          title="Remove item"
                        >
                          Remove
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                            Remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Clear Cart Button */}
              <div className="mt-6 flex justify-between">
                <button
                  className="text-red-600 font-semibold hover:text-red-800"
                  onClick={clearCart}
                  aria-label="Clear cart"
                >
                  Clear Cart
                </button>
                <Link
                  to="/"
                  className="text-red-600 font-semibold hover:text-red-800"
                  aria-label="Continue shopping"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                  aria-label={isSummaryOpen ? 'Collapse summary' : 'Expand summary'}
                >
                  <svg
                    className={`w-5 h-5 transform ${isSummaryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isSummaryOpen && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="text-gray-800">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {giftWrapTotal > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Gift Wrap</span>
                      <span className="text-gray-800">${giftWrapTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-red-600">
                      <span>Discount ({cartState.promo})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {/* Promo Code Input */}
                  <div className="mt-4">
                    <label htmlFor="promo" className="text-gray-600 text-sm mb-1 block">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        id="promo"
                        type="text"
                        className={`w-full p-2 border rounded-l-lg text-sm focus:ring-red-600 focus:border-red-600 ${promoError ? 'border-red-600' : 'border-gray-200'}`}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter code (e.g., SAVE10)"
                        aria-label="Promo code"
                      />
                      <button
                        className="bg-red-600 text-white px-4 rounded-r-lg hover:bg-red-700 transition duration-200"
                        onClick={applyPromo}
                        aria-label="Apply promo code"
                        title="Apply promo"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-600 text-xs mt-1 animate-fadeIn">{promoError}</p>
                    )}
                  </div>
                  <button
                    className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-300 mt-6"
                    onClick={handleCheckout}
                    aria-label="Proceed to checkout"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recentlyViewed.map((id) => {
                const product = products.find((p) => p.id === id);
                if (!product) return null;
                return (
                  <Link
                    key={id}
                    to={`/product/${id}`}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300 animate-zoomIn"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                      loading="lazy"
                    />
                    <h4 className="text-gray-800 font-semibold text-sm">{product.name}</h4>
                    <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
                    <StarRating rating={product.rating} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;