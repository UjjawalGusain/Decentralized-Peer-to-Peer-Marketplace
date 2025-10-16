import React, { useState, useEffect } from "react";
import APIS from "../../../api/api";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Button from "../ProductPage/Button";

function SellerDashboardPayouts() {
    const { user, token } = useAuth();
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.id && token) fetchPayouts();
    }, [user, token]);

    async function fetchPayouts() {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `${APIS.PAYOUTS_GET}?sellerId=${user.id}&status=successful`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(res);

            setPayouts(res.data);
        } catch (e) {
            setError("Failed to load payments.");
        } finally {
            setLoading(false);
        }
    }

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

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div>
                <h2 className="text-2xl font-semibold border-l-4 border-[#FEC010] pl-3 text-slate-900">
                    Your Payouts
                </h2>
                <p className="text-gray-600 mt-1">
                    Check out your successful payouts
                </p>
            </div>

            {/* Content */}
            {loading && (
                <p className="text-gray-600 text-center">Loading payouts...</p>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {!loading && payouts.length === 0 && (
                <p className="text-gray-600 text-center">No payouts found.</p>
            )}

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {payouts.map((payout) => (
                    <div
                        key={payout._id}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
                    >
                        {/* Top Section: Order Info */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 font-medium">
                                    Transaction ID
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-[#FEC010] border border-yellow-200">
                                    {new Date(
                                        payout.createdAt
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <p
                                className="text-base font-mono font-semibold text-slate-800 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 truncate"
                                title={payout._id}
                            >
                                {payout._id}
                            </p>

                            <div className="mt-4 border-t border-gray-100 pt-3">
                                <p className="text-sm text-gray-500 font-medium">
                                    Amount
                                </p>
                                <p className="text-2xl font-bold text-[#FEC010] tracking-tight">
                                    {payout.currency} {payout.amount}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SellerDashboardPayouts;
