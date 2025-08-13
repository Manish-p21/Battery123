import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

  const handleMouseEnter = (dropdown) => {
    setShowDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setShowDropdown(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      {/* Smoky transparent background */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/20 transition-all duration-500 rounded-t-2xl"></div>

      {/* Header content */}
      <header 
        className="relative w-full max-w-5xl mx-auto px-6 py-4 mt-3 mb-6 bg-white border shadow-2xl rounded-2xl border-t-4 border-red-600"
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex justify-between items-center flex-wrap gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7h6v10H9zM12 4h3v3h-3V4zm0 13h3v3h-3v-3z" />
            </svg>
            <Link to="/" className="text-3xl font-extrabold text-gray-900 hover:text-red-600 transition-colors duration-300">
              BatteryHub
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8 text-lg font-medium">
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('batteries')}
            >
              <div className="flex items-center space-x-1 text-gray-900 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                <span>Batteries</span>
                <svg className={`w-4 h-4 ${showDropdown === 'batteries' ? 'rotate-180' : ''} transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`absolute ${showDropdown === 'batteries' ? 'flex' : 'hidden'} flex-col bg-white border border-gray-200 shadow-xl rounded-lg px-6 py-4 bottom-full mb-1 w-64 opacity-0 ${showDropdown === 'batteries' ? 'opacity-100 transform -translate-y-2' : ''} transition-all duration-300 ease-in-out z-10`}>
                {batteryData.map(battery => (
                  <Link 
                    key={battery.id} 
                    to={`/Product?category=${encodeURIComponent(battery.name)}`} 
                    className="block py-2 px-4 text-base text-gray-800 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md"
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
              <div className="flex items-center space-x-1 text-gray-900 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                <span>Brands</span>
                <svg className={`w-4 h-4 ${showDropdown === 'brands' ? 'rotate-180' : ''} transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className={`absolute ${showDropdown === 'brands' ? 'flex' : 'hidden'} flex-col bg-white border border-gray-200 shadow-xl rounded-lg px-6 py-4 bottom-full mb-1 w-64 opacity-0 ${showDropdown === 'brands' ? 'opacity-100 transform -translate-y-2' : ''} transition-all duration-300 ease-in-out z-10`}>
                {brandData.map(brand => (
                  <Link 
                    key={brand.id} 
                    to={`/Product?brand=${encodeURIComponent(brand.name)}`} 
                    className="block py-2 px-4 text-base text-gray-800 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/Product?sortBy=priceAsc" className="text-gray-900 hover:text-red-600 transition-colors duration-300">Deals</Link>
            <Link to="/about" className="text-gray-900 hover:text-red-600 transition-colors duration-300">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/Product" className="text-gray-900 hover:text-red-600 transition-colors duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </Link>
            <Link to="/cart" className="text-gray-900 hover:text-red-600 transition-colors duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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