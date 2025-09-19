import React from "react";

const Hero = () => (
  <div className="rounded-lg overflow-hidden relative">
    <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600&q=80" alt="hero" className="w-full h-64 object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center">
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold">Best picks around you!</h1>
        <p className="mt-2">Discover trending items tailored to your neighborhood.</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Shop Now</button>
      </div>
    </div>
  </div>
);

export default Hero;
