import React, { useEffect, useState } from "react";

const slides = [
  { id: 1, title: "Power All Devices", description: "Explore batteries for every need.", buttonText: "Learn More", image: "/images/455.jpg" },
  { id: 2, title: "Long-Lasting Energy", description: "Reliable power for all applications.", buttonText: "Discover Now", image: "/images/12.png" },
  { id: 3, title: "Eco-Friendly Solutions", description: "Sustainable batteries for a greener future.", buttonText: "Go Green", image: "/images/1.jpg" },
  { id: 4, title: "High Performance", description: "Unmatched power for heavy-duty use.", buttonText: "Get Started", image: "/images/2.jpg" },
  { id: 5, title: "Rechargeable Innovation", description: "Cutting-edge rechargeable options.", buttonText: "See Details", image: "/images/3.jpg" },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Carousel Section (3/4 Width) */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-0"
            }`}
          >
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover"
              style={{
                backgroundImage: `url(${slide.image})`,
                objectFit: "cover",
              }}
            >
              <div className="w-full h-full bg-black bg-opacity-50 absolute top-0 left-0 z-10"></div>
              <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-left text-white p-6 max-w-md z-20">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg mb-6">{slide.description}</p>
                <button className="bg-white text-green-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-300">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Line-Based Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-white" : "w-4 bg-gray-500/50"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Shop Info Section (1/4 Width with Transparent Blur Background) */}
      <div className="absolute right-0 w-1/4 h-full border-l border-green-200/50 bg-black-200/50 backdrop-blur-xl text-white p-10 flex flex-col justify-center z-30">
        <h2 className="text-3xl font-extrabold mb-8 mt-8 tracking-tight">Visit Our Shop</h2>
        <div className="mb-8 border-l-4 border-green-600 pl-4">
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-md text-gray-200">123 Battery Lane, Power City, PC 12345</p>
        </div>
        <div className="mb-8 border-l-4 border-green-600 pl-4">
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <p className="text-md text-gray-200">Mobile: +1 (555) 123-4567</p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Find Us</h3>
          <div className="w-full h-40 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
            <p className="text-gray-300 text-center px-4">Map Placeholder (Google Maps Embed or Battery Photos)</p>
          </div>
        </div>
        <button className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 hover:scale-105 transition duration-300 ease-in-out">
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default Carousel;