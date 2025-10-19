import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import APIS from "../../../api/api";
import axios from "axios";
import Button from "../ProductPage/Button";

function SellerDashboardProducts() {
    const { user, token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getStatusStyles = (status) => {
        switch (status) {
            case "released":
                return "bg-green-100 text-green-700 border border-green-300";
            case "shipped":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            case "cancelled":
                return "bg-red-100 text-red-700 border border-red-300";
            case "escrowed":
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    useEffect(() => {
        if (user?.id && token) fetchProducts();
    }, [user, token]);

    async function fetchProducts() {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${APIS.PRODUCT_BY_SELLER}?sellerId=${user.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // console.log(res);

            setProducts(res.data.products);
        } catch (e) {
            setError("Failed to load payments.");
        } finally {
            setLoading(false);
        }
    }

    const handleViewItem = (productId) => {
        navigate(`/browse/${productId}`);
    };

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <h2 className="text-2xl font-semibold border-l-4 border-[#FEC010] pl-3 text-slate-900">
                    Your Products
                </h2>
                <p className="text-gray-600 mt-1">
                    Check out the products you sold
                </p>
            </div>

            {/* Content */}
            {loading && (
                <p className="text-gray-600 text-center">Loading products...</p>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {!loading && products.length === 0 && (
                <p className="text-gray-600 text-center">No products found.</p>
            )}

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
                    >
                        {/* Top Section: Order Info */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 font-medium">
                                    Title
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                                        product.status
                                    )}`}
                                >
                                    {product.status
                                        ? product.status
                                              .charAt(0)
                                              .toUpperCase() +
                                          product.status.slice(1)
                                        : "Unknown"}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-[#FEC010] border border-yellow-200">
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <p className="text-lg font-semibold text-slate-900 truncate">
                                {product.title}
                            </p>

                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <p className="text-sm text-gray-500 font-medium">
                                    Amount
                                </p>
                                <p className="text-2xl font-bold text-[#FEC010] tracking-tight">
                                    {product.currency} {product.price}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Section: Buyer + Button */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Product ID
                                </p>
                                <p className="text-base font-semibold text-slate-900">
                                    {product._id}
                                </p>
                            </div>

                            <Button
                                label={
                                    "View Item"
                                }
                                onSubmit={() =>
                                    handleViewItem(product._id)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SellerDashboardProducts;
