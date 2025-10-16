import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import APIS from "../../../api/api";
import axios from "axios";
import Button from "../ProductPage/Button";

function BuyerDashboardOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);

    const getStatusStyles = (status) => {
        switch (status) {
            case "received":
                return "bg-yellow-100 text-green-700 border border-green-300"
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
        if (user?.id && token) fetchOrders();
    }, [user, token]);

    // Fetch all orders for the seller
    async function fetchOrders() {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${APIS.ORDER_BY_BUYER}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(res);
            
            setOrders(res.data.orders);
        } catch (e) {
            setError("Failed to load payments.");
        } finally {
            setLoading(false);
        }
    }

    const handleOrderReceived = async (paymentId) => {
        setUpdatingId(paymentId);
        try {
            
            await axios.patch(
                `${APIS.PAYMENTS_UPDATE_BY_BUYER}`,
                {
                    razorpayOrderId: paymentId,
                    status: "received",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            

            // Refetch to reflect the update
            await fetchOrders();
            
        } catch (err) {
            console.error(err);
            alert("Failed to update payment status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };


    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <h2 className="text-2xl font-semibold border-l-4 border-[#FEC010] pl-3 text-slate-900">
                    Your orders
                </h2>
                <p className="text-gray-600 mt-1">
                    Check out the orders you sold
                </p>
            </div>

            {/* Content */}
            {loading && (
                <p className="text-gray-600 text-center">Loading orders...</p>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {!loading && orders.length === 0 && (
                <p className="text-gray-600 text-center">No orders found.</p>
            )}

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
                    >
                        {/* Top Section: Order Info */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                                        order.status
                                    )}`}
                                >
                                    {order.status
                                        ? order.status
                                              .charAt(0)
                                              .toUpperCase() +
                                          order.status.slice(1)
                                        : "Unknown"}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-[#FEC010] border border-yellow-200">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <p className="text-sm text-gray-500 font-medium">
                                    Amount
                                </p>
                                <p className="text-2xl font-bold text-[#FEC010] tracking-tight">
                                    {order.currency} {order.amount}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Section: Buyer + Button */}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    order ID
                                </p>
                                <p className="text-base font-semibold text-slate-900">
                                    {order._id}
                                </p>
                            </div>

                            {
                                order.status === "shipped" && (<Button
                                label={
                                    "Received Item"
                                }
                                onSubmit={() =>
                                    handleOrderReceived(order.razorpayOrderId)
                                }
                            />)
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerDashboardOrders;
