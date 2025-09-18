import React, { useState, useEffect } from "react";
import axios from "axios";
import APIS from "../../api/api";

const categories = ["all", "electronics", "clothing", "books", "home", "other"];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (category !== "all") params.category = category;
      if (search.trim()) params.search = search.trim();

      const response = await axios.get(`${APIS.PRODUCTS}`, { params });
      setProducts(response.data.products);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">
            Product <span className="text-teal-500">Listings</span>
          </h1>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg border shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 flex-grow rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Messages */}
        {loading && <p className="text-teal-500 font-medium">Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!loading && products.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No products found matching your criteria.
            </p>
          )}

          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl shadow-sm hover:shadow-lg transition p-4 bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
              )}
              <h2 className="font-semibold text-lg mb-1">{product.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.category}
              </p>
              <p className="text-sm mb-2">{product.description}</p>
              <p className="font-bold text-teal-600 dark:text-teal-400">
                {product.currency} {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
