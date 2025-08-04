import React, { useEffect, useState } from "react";

const slides = [
  { id: 1, title: "Power All Devices", description: "Explore batteries for every need.", buttonText: "Learn More", image: "/images/12.png"},
  { id: 2, title: "Long-Lasting Energy", description: "Reliable power for all applications.", buttonText: "Discover Now", image: "/images/12.png"},
  { id: 3, title: "Eco-Friendly Solutions", description: "Sustainable batteries for a greener future.", buttonText: "Go Green", image: "/images/12.png"},
  { id: 4, title: "High Performance", description: "Unmatched power for heavy-duty use.", buttonText: "Get Started", image: "/images/12.png"},
  { id: 5, title: "Compact Power", description: "Small batteries, big energy.", buttonText: "Explore Today", image: "/images/12.png"},
  { id: 6, title: "Rechargeable Innovation", description: "Cutting-edge rechargeable options.", buttonText: "See Details", image: "/images/12.png"},
  { id: 7, title: "Portable Energy", description: "Take power anywhere with ease.", buttonText: "Shop Now", image: "/images/12.png"},
  { id: 8, title: "Durable Design", description: "Built to last in any condition.", buttonText: "Learn More", image: "/images/12.png"},
  { id: 9, title: "Affordable Power", description: "Quality batteries at great prices.", buttonText: "Buy Now", image: "/images/12.png"},
  { id: 10, title: "Smart Battery Tech", description: "Intelligent power for modern needs.", buttonText: "Discover Now", image: "/images/12.png"},
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
    <div className="relative w-full h-screen overflow-hidden">
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
              index === currentSlide
                ? "w-6 bg-white"
                : "w-4 bg-gray-500/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
