import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/battery/header.js';
import Hero from '../components/battery/hero.js';
import Hero1 from '../components/battery/hero1.js';
import Hero2 from '../components/battery/hero2.js';
import Description from '../components/battery/description.js';

const Battery = () => {
  return (
    <div className="min-h-screen w-full bg-white pb-16">
      <Header />
      <Hero />
      <Hero1 />
      <Hero2 />
      {/* Main content area */}
      <Routes>
        <Route path="/product/battery/:id" element={<Description />} />
      </Routes>
    </div>
  );
};

export default Battery;