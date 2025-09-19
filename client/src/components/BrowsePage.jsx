import FiltersSidebar from "./BrowsePage/FiltersSidebar"; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import APIS from "../../api/api";
import ProductGrid from "./ProductPage/ProductGrid";

const BrowsePage = ({ search }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]); 
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState(5000);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch updated on all these filters too
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (category.length > 0) params.category = category.join(",");
      if (search.trim()) params.search = search.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      console.log(`Max distance: ${maxDistance}`);
      
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.maxDistance = maxDistance * 1000;
      }
      if (sortBy) params.sortBy = sortBy;

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
  }, [search, category, minPrice, maxPrice, lat, lng, sortBy, maxDistance]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2">
            <ProductGrid loading={loading} error={error} products={products} />
          </section>
          <section className="md:col-span-1">
            <FiltersSidebar
              category={category}
              setCategory={setCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              lat={lat}
              setLat={setLat}
              lng={lng}
              setLng={setLng}
              sortBy={sortBy}
              setSortBy={setSortBy}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              onApplyFilters={fetchProducts}
            />
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default BrowsePage;
