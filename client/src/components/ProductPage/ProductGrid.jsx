import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ loading, error, products, addToCart }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Featured products</h2>

      {loading && <p className="text-blue-500">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No products found matching your criteria.
          </p>
        )}

        {products.map((p) => (
          <ProductCard key={p._id} product={p} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
