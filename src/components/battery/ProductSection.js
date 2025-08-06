import React from "react";

const ProductSection = () => {
  return (
    <div className="relative z-20 py-20 bg-gradient-to-br from-green-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-16 animate-slide-up">
          Explore Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <img
              src="/images/1.jpg"
              alt="PowerUp Pro Battery"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">PowerUp Pro</h3>
            <p className="text-gray-600 mt-2">
              Engineered for heavy-duty machinery and professional applications, delivering unmatched durability and extended lifespan.
            </p>
          </div>

          {/* Product 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <img
              src="/images/2.jpg"
              alt="PowerUp Eco Battery"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">PowerUp Eco</h3>
            <p className="text-gray-600 mt-2">
              Sustainable battery designed for home appliances, offering eco-friendly materials and efficient energy for everyday use.
            </p>
          </div>

          {/* Product 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <img
              src="/images/3.jpg"
              alt="PowerUp Ultra Battery"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">PowerUp Ultra</h3>
            <p className="text-gray-600 mt-2">
              High-performance battery for cars and motorbikes, optimized for maximum efficiency and reliable power delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;