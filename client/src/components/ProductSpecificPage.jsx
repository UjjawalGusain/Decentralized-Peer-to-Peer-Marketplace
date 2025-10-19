import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import APIS from "../../api/api";
import ProductSection from "./ProductSpecificPage/ProductSection";
import { loadRazorpayScript, getRazorpayOptions } from "../utils/razorpay";
import axios from "axios";

function ProductSpecificPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const { token, user } = useAuth();

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const response = await fetch(`${APIS.PRODUCTS}/${id}`);
                if (!response.ok) throw new Error("Product not found");
                const data = await response.json();
                setProduct(data);
                // console.log("Data: ");
                // console.log(data);
                
                
                setMainImage(
                    data.images && data.images.length > 0
                        ? data.images[0]
                        : null
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    const handleBuy = useCallback(async () => {
        try {
            if (!token) return alert("Please login to make a purchase");
            if (!product) return alert("Product details missing");

            // Step 1: Create order on backend
            const payload = {
                amount: product.price,
                currency: product.currency || "INR",
                buyerId: user.id,
                sellerId: product.sellerId,
                productId: product._id,
            };
            const response = await axios.post(APIS.ORDERS_CREATE, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { order } = response.data;

            // Step 2: Load Razorpay Script
            const razorpayLoaded = await loadRazorpayScript();
            if (!razorpayLoaded) return alert("Failed to load Razorpay SDK.");
            if (!window.Razorpay) return alert("Razorpay SDK not available.");

            // Step 3: Setup checkout options
            const options = getRazorpayOptions({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order,
                product,
                user,
                token,
                onSuccess: async (response) => {
                    alert(
                        `Payment successful. Payment ID: ${response.razorpay_payment_id}`
                    );
                    // Step 4: Verify payment
                    try {
                        const verificationResponse = await axios.post(
                            APIS.PAYMENTS_VERIFY,
                            {
                                razorpayOrderId: order.id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (verificationResponse.data.success) {
                            alert("Payment verified successfully.");
                            await axios.patch(
                                APIS.PAYMENTS_UPDATE_BY_BUYER,
                                {
                                    razorpayOrderId: order.id,
                                    status: "escrowed",
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            alert("Payment status updated to escrowed.");
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        alert("Error verifying payment.");
                    }
                },
            });

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Order creation failed", error);
            alert("Unable to create order. Please try again.");
        }
    }, [product, token, user]);

    if (loading)
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    if (error)
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    if (!product) return null;

    return (
        <div className="min-h-full bg-gray-50 font-sans">
            <ProductSection
                product={product}
                mainImage={mainImage}
                setMainImage={setMainImage}
                handleBuy={handleBuy}
            />
        </div>
    );
}

export default ProductSpecificPage;
