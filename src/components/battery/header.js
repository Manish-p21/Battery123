import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const batteryData = [
  { "id": "1", "name": "Car Battery" },
  { "id": "2", "name": "Bike Battery" },
  { "id": "3", "name": "Inverter Battery" },
  { "id": "4", "name": "Home UPS" }
];

const brandData = [
  { "id": "1", "name": "Amaron" },
  { "id": "2", "name": "Exide" },
  { "id": "3", "name": "Livguard" }
];

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleMouseEnter = (dropdown) => {
    setShowDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setShowDropdown(null);
  };

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setLoadingSuggestions(true);
        axios.get('https://battery-api-6an6.onrender.com/api/batteries', {
          params: { search: searchQuery }
        })
          .then((res) => {
            if (res.data.success) {
              const products = res.data.data || [];
              const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
              ).slice(0, 5); // Limit to 5 suggestions
              setSuggestions(filtered);
            }
          })
          .catch((error) => {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]); // Fallback to empty on error
          })
          .finally(() => setLoadingSuggestions(false));
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery) {
      e.preventDefault();
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    window.location.href = `/search?query=${encodeURIComponent(suggestion.name)}`;
    setSuggestions([]);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Header content */}
      <header 
        className="relative w-full mx-auto px-6 py-2 bg-white border-b-2 border-green-600 shadow-lg"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex justify-between items-center flex-wrap gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7h6v10H9zM12 4h3v3h-3V4zm0 13h3v3h-3v-3z" />
            </svg>
            <Link to="/" className="text-2xl font-extrabold text-gray-900 hover:text-green-600 transition-colors duration-300">
              BatteryHub
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-10 text-md font-medium">
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('batteries')}
            >
              <div className="flex items-center space-x-1 text-gray-900 hover:text-green-600 transition-colors duration-300 cursor-pointer">
                <span>Batteries</span>
                <svg className={`w-4 h-4 ${showDropdown === 'batteries' ? 'rotate-180' : ''} transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`absolute ${showDropdown === 'batteries' ? 'flex' : 'hidden'} flex-col bg-white border border-gray-200 shadow-xl rounded-lg px-6 py-4 top-full mt-1 w-64 opacity-0 ${showDropdown === 'batteries' ? 'opacity-100 transform translate-y-2' : ''} transition-all duration-300 ease-in-out z-10`}>
                {batteryData.map(battery => (
                  <Link 
                    key={battery.id} 
                    to={`/search?category=${encodeURIComponent(battery.name)}`} 
                    className="block py-2 px-4 text-base text-gray-800 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 rounded-md"
                  >
                    {battery.name}
                  </Link>
                ))}
              </div>
            </div>
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('brands')}
            >
              <div className="flex items-center space-x-1 text-gray-900 hover:text-green-600 transition-colors duration-300 cursor-pointer">
                <span>Brands</span>
                <svg className={`w-4 h-4 ${showDropdown === 'brands' ? 'rotate-180' : ''} transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`absolute ${showDropdown === 'brands' ? 'flex' : 'hidden'} flex-col bg-white border border-gray-200 shadow-xl rounded-lg px-6 py-4 top-full mt-1 w-64 opacity-0 ${showDropdown === 'brands' ? 'opacity-100 transform translate-y-2' : ''} transition-all duration-300 ease-in-out z-10`}>
                {brandData.map(brand => (
                  <Link 
                    key={brand.id} 
                    to={`/search?brand=${encodeURIComponent(brand.name)}`} 
                    className="block py-2 px-4 text-base text-gray-800 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 rounded-md"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/search?sortBy=priceAsc" className="text-gray-900 hover:text-green-600 transition-colors duration-300">Deals</Link>
            <Link to="/about" className="text-gray-900 hover:text-green-600 transition-colors duration-300">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center text-black space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-60 px-4 py-2 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:w-[700px] transition-all duration-300"
              />
              <svg
                className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              {loadingSuggestions && <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500">Loading...</span>}
              {(suggestions.length > 0 && searchQuery) && (
                <div className="absolute top-full mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-10">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion._id.$oid || suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block py-2 px-4 text-base text-gray-800 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 rounded-md cursor-pointer"
                    >
                      {suggestion.name} ({suggestion.brand})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/cart" className="text-gray-900 hover:text-green-600 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;