import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Filters = ({ onApplyFilters, onResetFilters, isMobile }) => {
  const [priceRange, setPriceRange] = useState([2000, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [error, setError] = useState(null);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [brandsRes, categoriesRes, capacitiesRes] = await Promise.all([
          axios.get('https://battery-api-6an6.onrender.com/api/brands'),
          axios.get('https://battery-api-6an6.onrender.com/api/categories'),
          axios.get('https://battery-api-6an6.onrender.com/api/capacities'),
        ]);
        console.log('Filter options fetched:', {
          brands: brandsRes.data,
          categories: categoriesRes.data,
          capacities: capacitiesRes.data,
        });
        setBrands(brandsRes.data.success ? brandsRes.data.data : []);
        setCategories(categoriesRes.data.success ? categoriesRes.data.data : []);
        setCapacities(capacitiesRes.data.success ? capacitiesRes.data.data : []);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError('Failed to load filter options');
      }
    };
    fetchFilterOptions();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (value, selectedItems, setSelectedItems) => {
    const updatedItems = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
    setSelectedItems(updatedItems);
  };

  // Handle apply filters
  const handleApply = () => {
    const filters = {
      priceRange,
      brands: selectedBrands,
      categories: selectedCategories,
      capacities: selectedCapacities,
    };
    console.log('Applying filters:', filters);
    onApplyFilters(filters);
  };

  // Handle reset filters
  const handleReset = () => {
    setPriceRange([2000, 10000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedCapacities([]);
    console.log('Resetting filters');
    onResetFilters();
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <section className="py-8 text-black font-poppins">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          {isMobile && (
            <button
              onClick={handleReset}
              className="text-blue-600 font-semibold hover:text-blue-800"
              aria-label="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg border grid gap-6 grid-cols-1">
          <div className="bg-red-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Price Range</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2000"
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full accent-red-600"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min="2000"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-red-600"
                  aria-label="Maximum price"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Brands</label>
            <div className="grid gap-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleCheckboxChange(brand, selectedBrands, setSelectedBrands)}
                    className="accent-red-600"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Categories</label>
            <div className="grid gap-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange(category, selectedCategories, setSelectedCategories)}
                    className="accent-red-600"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <label className="block text-gray-700 font-semibold mb-2">Capacities</label>
            <div className="grid gap-2">
              {capacities.map((capacity) => (
                <label key={capacity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCapacities.includes(capacity)}
                    onChange={() => handleCheckboxChange(capacity, selectedCapacities, setSelectedCapacities)}
                    className="accent-red-600"
                  />
                  {capacity}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleApply}
              className="w-full sm:flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-300"
              aria-label="Apply filters"
            >
              Apply Filters
            </button>
            {!isMobile && (
              <button
                onClick={handleReset}
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

Filters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Filters;