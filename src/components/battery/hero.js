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
      <div className="absolute right-0 w-1/4 h-full border-l border-green-200/50 bg-black/50 backdrop-blur-xl text-white p-10 flex flex-col justify-center z-30">
        <h2 className="text-3xl font-extrabold mb-8 mt-8 tracking-tight">Visit Our Shop</h2>
        <div className="mb-8 border-l-4 border-green-600 pl-4">
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-md text-gray-200">H.NO.2093, MIDC Rd, near Mukund Company, Ram Nagar, Dighe, Navi Mumbai, Maharashtra 400708</p>
        </div>
        <div className="mb-8 border-l-4 border-green-600 pl-4">
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <p className="text-md text-gray-200">Mobile: +91 9869677994</p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Find Us</h3>
          <div className="w-full h-40 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d783!2d72.997892!3d19.1806029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf2930dce389%3A0xc4a11f0701efe1b3!2sNational%20Battery%20Service!5e0!3m2!1sen!2sin!4v1698765432109!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <a
          href="https://www.google.com/maps/place/National+Battery+Service/@19.1806029,72.997892,783m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be7bf2930dce389:0xc4a11f0701efe1b3!8m2!3d19.1806029!4d72.997892!16s%2Fg%2F11gfndvlv9?entry=ttu&g_ep=EgoyMDI1MDgwMy4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 hover:scale-105 transition duration-300 ease-in-out text-center"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default Carousel;