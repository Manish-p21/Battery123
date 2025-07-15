import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white font-poppins border-t border-gray-200 py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">About Us</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted source for high-quality batteries, chargers, inverters, UPS, and solar solutions.
            </p>
            <div className="flex space-x-4">
              <a href="/w" className="text-gray-600 hover:text-green-600 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.91-1.39h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.09 5.39z" />
                </svg>
              </a>
              <a href="/r" className="text-gray-600 hover:text-green-600 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="/a" className="text-gray-600 hover:text-green-600 transition duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.99 4.69C23.81 3.78 23 3.07 22.09 2.89 20.28 2.5 12 2.5 12 2.5s-8.28 0-10.09.39C1 3.07.19 3.78 0 4.69 0 6.5 0 9.5 0 12s0 5.5 0 7.31c.19.91 1 1.62 1.91 1.8 1.81.39 10.09.39 10.09.39s8.28 0 10.09-.39c.91-.18 1.72-.89 1.91-1.8 0-1.81 0-4.81 0-7.31s0-5.5 0-7.31zM9.5 16.5V7.5l7.5 4.5-7.5 4.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>
                <button
                  onClick={() => navigate('/home')}
                  className="hover:text-green-600 transition duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/batteries?category=batteries')}
                  className="hover:text-green-600 transition duration-300"
                >
                  Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/batteries?category=chargers')}
                  className="hover:text-green-600 transition duration-300"
                >
                  Chargers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/batteries?category=inverters')}
                  className="hover:text-green-600 transition duration-300"
                >
                  Inverters
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/batteries?category=ups')}
                  className="hover:text-green-600 transition duration-300"
                >
                  UPS
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/batteries?category=solar')}
                  className="hover:text-green-600 transition duration-300"
                >
                  Solar
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Service</h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>
                <a href="/s" className="hover:text-green-600 transition duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/d" className="hover:text-green-600 transition duration-300">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/d" className="hover:text-green-600 transition duration-300">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/h" className="hover:text-green-600 transition duration-300">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/h" className="hover:text-green-600 transition duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest offers and updates.
            </p>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <button
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} BatteryHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {};
export default Footer;