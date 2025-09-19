import React from "react";
import Button from "./Button";

const ProductCard = ({ product, addToCart }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="relative">
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-40 object-cover rounded"
        />
      )}
    </div>
    <div className="mt-3 font-inter">
      <div className="flex flex-col justify-between items-start">
        <h3 className="font-medium text-gray-800 text-sm">{product.title}</h3>
        <div className="font-semibold text-xl">
          {product.currency} {product.price}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-4 flex gap-2">
        <Button label={"Buy"} padding={"9"} />
      </div>
    </div>
  </div>
);

export default ProductCard;
