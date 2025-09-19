import React, { useState, useEffect } from "react";
import axios from "axios";
import APIS from "../../api/api";
import Header from "./ProductPage/Header";
import Hero from "./ProductPage/Hero";
import CategoryGrid from "./ProductPage/CategoryGrid";
import CartSummary from "./ProductPage/CartSummary";
import Footer from "./ProductPage/Footer";
const Home = () => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products
  const fetchCategoryProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (category !== "all") params.category = category;
      if (search.trim()) params.search = search.trim();

      const response = await axios.get(`${APIS.PRODUCTS_TOP}`, { params });
      console.log(response.data.categoryProducts);

      setCategory(response.data.categoryProducts);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [search]);

  // Local filtering

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2">
            <Hero />

            <CategoryGrid
              loading={loading}
              error={error}
              categories={category}
            />
          </section>
        </div>

      </main>
      <div className="fixed bottom-[-20px] right-0 m-4 w-56 h-80 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 text-black bg-opacity-50 rounded px-2 py-1 select-none pointer-events-auto">
            Hey guys! This is me Bill
          </div>
          <img
            src="./talking_ducky.png"
            alt="Decoration"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
