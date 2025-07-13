import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Benefit data for "Why Choose Us"
const benefits = [
  {
    id: 1,
    title: 'Eco-Friendly Power',
    description: 'Our batteries are designed with sustainability in mind, using recyclable materials to reduce environmental impact.',
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Fast & Free Shipping',
    description: 'Enjoy quick delivery on all orders with free shipping across the country.',
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Certified Quality',
    description: 'All products undergo rigorous testing to ensure top performance and safety.',
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Our team is here to assist you anytime with expert advice and solutions.',
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
];

// Hero2 component for "Why Choose Us"
const Hero2 = () => {
  return (
    <section className="py-16 bg-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the reasons thousands trust us for their power needs, from sustainable solutions to exceptional service.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
              role="article"
              aria-label={`Benefit: ${benefit.title}`}
            >
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            aria-label="Shop now for batteries and chargers"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

// PropTypes for type-checking
Hero2.propTypes = {
  // No props currently
};

export default Hero2;