import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import APIS from "../../api/api";
import axios from "axios";

function SellerDashboard() {
    const { user, token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch seller orders on mount
    useEffect(() => {
        if (user?.id && token) {
            fetchOrders();
        }
    }, [user, token]);

    async function fetchOrders() {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${APIS.ORDER_BY_SELLER}?sellerId=${user.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setOrders(res.data.orders);
        } catch (e) {
            setError("Failed to load orders.");
        }
        setLoading(false);
    }

    async function updateOrderStatus(orderId, newStatus) {
        try {
            await axios.patch(
                APIS.PAYMENTS_UPDATE_BY_SELLER,
                {
                    razorpayOrderId: orderId,
                    status: newStatus,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            fetchOrders();
        } catch (e) {
            alert("Failed to update order status");
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6">Seller Dashboard</h1>

            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && orders.length === 0 && <p>No current orders.</p>}

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.razorpayOrderId}
                        className="border p-4 rounded shadow"
                    >
                        <p>
                            <strong>Order ID:</strong> {order.razorpayOrderId}
                        </p>
                        <p>
                            <strong>Product ID:</strong> {order.productId}
                        </p>
                        <p>
                            <strong>Status:</strong> {order.status}
                        </p>
                        <p>
                            <strong>Amount:</strong> ₹{order.amount}
                        </p>
                        <div className="space-x-2 mt-3">
                            {order.status === "escrowed" && (
                                <>
                                    <button
                                        onClick={() =>
                                            updateOrderStatus(
                                                order.razorpayOrderId,
                                                "shipped"
                                            )
                                        }
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Mark as Shipped
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateOrderStatus(
                                                order.razorpayOrderId,
                                                "cancelled"
                                            )
                                        }
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Reject Order
                                    </button>
                                </>
                            )}
                            {order.status === "shipped" && (
                                <span className="italic text-gray-600">
                                    Waiting for buyer confirmation
                                </span>
                            )}
                            {order.status === "released" && (
                                <span className="text-green-600 font-semibold">
                                    Payment Released
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SellerDashboard;
