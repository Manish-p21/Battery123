import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Battery-specific filter options
const BRANDS = ['All Brands', 'Amaron', 'Exide', 'Luminous', 'PowerZONE'];
const BATTERY_TYPES = ['All Types', 'Car Battery', 'Inverter Battery', 'Generator Battery'];
const CAPACITIES = ['All Capacities', 'Below 50Ah', '50Ah - 100Ah', '100Ah - 150Ah', 'Above 150Ah'];

const Filter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([2000, 5000]);
  const [brand, setBrand] = useState('All Brands');
  const [batteryType, setBatteryType] = useState('All Types');
  const [capacity, setCapacity] = useState('All Capacities');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle filter application
  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      brand: brand === 'All Brands' ? null : brand,
      batteryType: batteryType === 'All Types' ? null : batteryType,
      capacity: capacity === 'All Capacities' ? null : capacity,
    });
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setPriceRange([2000, 5000]);
    setBrand('All Brands');
    setBatteryType('All Types');
    setCapacity('All Capacities');
    onFilterChange({
      priceRange: [2000, 5000],
      brand: null,
      batteryType: null,
      capacity: null,
    });
  };

  return (
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
        <div className="bg-white p-6 rounded-lg border  grid gap-6 grid-cols-1 auto-rows-auto">
          {/* Price Range Filter */}
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
                  max="5000"
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

          {/* Brand Filter */}
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              aria-label="Battery brand"
            >
              {BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Battery Type Filter */}
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Type</label>
            <select
              value={batteryType}
              onChange={(e) => setBatteryType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              aria-label="Battery type"
            >
              {BATTERY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity Filter */}
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              aria-label="Battery capacity"
            >
              {CAPACITIES.map((cap) => (
                <option key={cap} value={cap}>
                  {cap}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
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
  );
};

Filter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;