import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './header.js';

// Updated SectionContainer component
const SectionContainer = ({ 
  children, 
  className = '', 
  maxWidth = 'lg', 
  bgColor = 'transparent',
  padding = 'default'
}) => {
  const widthMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-xl',
    full: 'w-full'
  };

  const paddingMap = {
    none: 'p-0',
    small: 'px-4 py-2 sm:px-6 sm:py-4',
    default: 'px-6 py-4 sm:px-8 sm:py-6',
    large: 'px-8 py-6 sm:px-12 sm:py-8'
  };

  return (
    <div 
      className={`
        mx-auto
        ${widthMap[maxWidth] || widthMap['lg']}
        ${paddingMap[padding] || paddingMap['default']}
        ${bgColor}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

SectionContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  bgColor: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large'])
};

// WaterRippleEffect component
function WaterRippleEffect({ children }) {
  const containerRef = useRef();
  const [ripples, setRipples] = useState([]);

  const handleMouseEnter = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples([...ripples, { x, y, size: 0, opacity: 1 }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prev) =>
        prev
          .map((ripple) => ({
            ...ripple,
            size: ripple.size + 5,
            opacity: ripple.opacity - 0.02,
          }))
          .filter((ripple) => ripple.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white pb-16">
      <div
        ref={containerRef}
        className="relative overflow-hidden backdrop-blur-md bg-white/10 border border-gray-200 rounded-lg p-6 py-12 animate-fadeIn"
        onMouseEnter={handleMouseEnter}
      >
        {ripples.map((ripple, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-red-600/20 pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              opacity: ripple.opacity,
            }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}

WaterRippleEffect.propTypes = {
  children: PropTypes.node.isRequired
};

const About = () => {
  return (
    <div className="relative bg-white min-h-screen pb-20 pt-20 w-full font-poppins text-gray-800 overflow-hidden">
      <Header />
      {/* Hero Section */}
      <SectionContainer maxWidth="lg" padding="large" className="mb-0 text-center animate-slideUp">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">About Ampere Innovations</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Empowering the world with cutting-edge power solutions. We design batteries and chargers that redefine performance, sustainability, and reliability.
        </p>
      </SectionContainer>

      {/* Mission Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At Ampere Innovations, our mission is to power the future with innovative, eco-friendly energy solutions. Founded in 2018, we set out to address the growing demand for reliable, high-performance batteries and chargers in a world increasingly dependent on portable technology. We believe that power should be seamless, sustainable, and accessible to all. Our products, from the UltraMax Li-Ion Battery to the HyperCharge 100W Charger, are engineered to deliver unmatched performance while minimizing environmental impact. We strive to create a world where devices never run out of power, and where energy solutions contribute to a reder planet.
          </p>
        </WaterRippleEffect>
      </SectionContainer>

      {/* History Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2018</div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-800">Founding of Ampere</h3>
                <p className="text-gray-600">
                  Ampere Innovations was born in a small garage in Silicon Valley, where a group of engineers envisioned a new era of portable power. Their first product, a 5,000mAh power bank, set the stage for innovation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2020</div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-800">Breakthrough in Li-Ion Technology</h3>
                <p className="text-gray-600">
                  Our R&D team developed a proprietary lithium-ion cell with 20% higher energy density, leading to the launch of the UltraMax Li-Ion Battery, a bestseller across 30 countries.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2023</div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-800">Global Expansion</h3>
                <p className="text-gray-600">
                  Ampere opened offices in Europe and Asia, partnering with leading tech brands to integrate our chargers into their ecosystems. We also introduced solar-powered chargers like the EcoSolar Kit.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2025</div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-800">Sustainability Milestone</h3>
                <p className="text-gray-600">
                  Achieved 100% recyclable packaging and reduced carbon emissions by 40% in manufacturing. Launched the MaxPower Battery Bundle, catering to diverse household needs.
                </p>
              </div>
            </div>
          </div>
        </WaterRippleEffect>
      </SectionContainer>

      {/* Team Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Meet Our Team</h2>
          <p className="text-gray-600 mb-8">
            Our team is a blend of engineers, designers, and visionaries united by a passion for power innovation. Here are some of the minds behind Ampere Innovations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center animate-zoomIn">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300"></div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Dr. Elena Martinez</h3>
              <p className="text-gray-600 text-sm">Chief Technology Officer</p>
              <p className="text-gray-600 text-sm mt-2">
                With a PhD in Materials Science, Elena leads our R&D, pioneering advancements in battery efficiency and safety.
              </p>
            </div>
            <div className="text-center animate-zoomIn">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300"></div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">James Patel</h3>
              <p className="text-gray-600 text-sm">CEO & Founder</p>
              <p className="text-gray-600 text-sm mt-2">
                James’s vision for sustainable power solutions drives Ampere’s mission. He has 15 years of experience in tech startups.
              </p>
            </div>
            <div className="text-center animate-zoomIn">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300"></div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">Sophie Chen</h3>
              <p className="text-gray-600 text-sm">Head of Design</p>
              <p className="text-gray-600 text-sm mt-2">
                Sophie crafts sleek, user-friendly designs for our products, ensuring form meets function in every charger and battery.
              </p>
            </div>
          </div>
        </WaterRippleEffect>
      </SectionContainer>

      {/* Technology Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Technology</h2>
          <p className="text-gray-600 mb-8">
            Ampere Innovations is at the forefront of power technology, leveraging cutting-edge advancements to deliver superior products.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">High-Density Li-Ion Cells</h3>
              <p className="text-gray-600">
                Our proprietary lithium-ion cells offer up to 25% higher energy density than industry standards, enabling compact yet powerful batteries like the PowerPlus 20,000mAh Bank.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Gallium Nitride (GaN) Chargers</h3>
              <p className="text-gray-600">
                Using GaN technology, our chargers, such as the HyperCharge 100W, achieve up to 93% energy efficiency, reducing heat and size while delivering ultra-fast charging.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Smart Charging Algorithms</h3>
              <p className="text-gray-600">
                Our chargers feature AI-driven power allocation, optimizing output for devices to ensure safety and speed, as seen in the ThunderHub Multi-Port Charger.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Solar Integration</h3>
              <p className="text-gray-600">
                Products like the EcoPower Solar Battery use high-efficiency monocrystalline panels, providing sustainable charging for off-grid adventures.
              </p>
            </div>
          </div>
        </WaterRippleEffect>
      </SectionContainer>

      {/* Sustainability Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800	NAVBAR mb-8">Commitment to Sustainability</h2>
          <p className="text-gray-600 mb-8">
            We believe in powering the planet responsibly. Our sustainability initiatives are woven into every aspect of our operations.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-8">
            <li><strong>Recyclable Materials:</strong> All our packaging is 100% recyclable, and our batteries, like the MegaVolt AA Pack, use eco-friendly components.</li>
            <li><strong>Carbon Reduction:</strong> We’ve reduced manufacturing emissions by 40% since 2020 through energy-efficient processes.</li>
            <li><strong>Battery Recycling Program:</strong> Customers can return used batteries for recycling at no cost, ensuring responsible disposal.</li>
            <li><strong>Renewable Energy:</strong> Our facilities run on 70% solar and wind power, with a goal of 100% by 2030.</li>
            <li><strong>Long-Lasting Products:</strong> Our batteries and chargers are designed for durability, reducing the need for frequent replacements.</li>
          </ul>
        </WaterRippleEffect>
      </SectionContainer>

      {/* Customer Commitment Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Promise to You</h2>
          <p className="text-gray-600 mb-8">
            At Ampere, our customers are at the heart of everything we do. We’re committed to delivering exceptional products and experiences.
          </p>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product undergoes rigorous testing for safety, performance, and durability, backed by warranties like the 2-year coverage on the UltraMax Li-Ion Battery.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Customer Support</h3>
              <p className="text-gray-600">
                Our 24/7 support team is available via chat, email, or phone, ensuring quick resolution of any issues. We also offer a 30-day money-back guarantee.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Transparency</h3>
              <p className="text-gray-600">
                From clear product specifications to honest reviews, we provide all the information you need to make informed decisions.
              </p>
            </div>
          </div>
        </WaterRippleEffect>
      </SectionContainer>

      {/* Community Section */}
      <SectionContainer maxWidth="lg" padding="none" className="mb-0">
        <WaterRippleEffect>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Giving Back</h2>
          <p className="text-gray-600 mb-8">
            We’re committed to making a positive impact beyond our products. Our community initiatives focus on education, access, and environmental stewardship.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">STEM Education</h3>
              <p className="text-gray-600">
                We fund STEM programs in underserved schools, providing resources and mentorship to inspire the next generation of innovators.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Power Access</h3>
              <p className="text-gray-600">
                Through partnerships with NGOs, we donate solar chargers to remote communities, ensuring access to reliable power.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Environmental Cleanups</h3>
              <p className="text-gray-600">
                Our team organizes global cleanup events, removing e-waste and promoting responsible recycling practices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Employee Volunteering</h3>
              <p className="text-gray-600">
                Ampere employees receive paid time off to volunteer, contributing over 5,000 hours annually to local causes.
              </p>
            </div>
          </div>
        </WaterRippleEffect>
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer maxWidth="lg" padding="large" className="mb-0 text-center animate-slideUp">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Join the Power Revolution</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Discover our innovative batteries and chargers, and become part of a community dedicated to sustainable, high-performance power.
        </p>
        <Link
          to="/products"
          className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 text-lg font-semibold"
        >
          Explore Products
        </Link>
      </SectionContainer>

      {/* Footer */}
      <SectionContainer maxWidth="lg" padding="large">
        <footer className="py-12">
          <p className="text-center text-gray-600 text-sm">© 2025 Ampere Innovations. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="/s" className="hover:text-gray-800">Privacy Policy</a>
            <a href="/s" className="hover:text-gray-800">Terms of Service</a>
            <a href="/s" className="hover:text-gray-800">Contact Us</a>
          </div>
        </footer>
      </SectionContainer>
    </div>
  );
};

export default About;