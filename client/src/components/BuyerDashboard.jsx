import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BuyerDashboardOrders from "./BuyerDashboard/BuyerDashboardOrders";
import BuyerDashboardHeader from "./BuyerDashboard/BuyerDashboardHeader";
import ErrorPage from "./ErrorPages/ErrorPage";


function BuyerDashboard() {
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState("Products");

    if (!user) return <ErrorPage message={"Sorry you have not logged in so you don't have access to this page."}/>;

    if (!user.roles.includes("buyer")) return <ErrorPage message={"Sorry you are not a buyer"}/>;
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12 relative overflow-visible">
            <h1 className="text-4xl font-bold font-inter text-[#FEC010] mb-6 relative z-10">
                Your Buyer Dashboard!
            </h1>

            <BuyerDashboardHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div>
                {activeTab === "Products" && <BuyerDashboardOrders />}
            </div>
        </div>
    );
}

export default BuyerDashboard;
