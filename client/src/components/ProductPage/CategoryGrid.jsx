import React from "react";
import ProductCard from "./ProductCard";

const CategoryGrid = ({ loading, error, categories }) => {
  return (
    <div className="mt-8 space-y-12">
      {categories.map((category) => (
        <div key={category.category}>
          {/* Category Heading */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 capitalize border-b pb-2">
            {category.category}
          </h2>

          {/* Loading & Error States */}
          {loading && (
            <p className="text-blue-500 text-sm mb-4">Loading products...</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && category.products.length === 0 && (
              <p className="col-span-full text-center text-gray-500 text-sm">
                No products found in this category.
              </p>
            )}

            {category.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
