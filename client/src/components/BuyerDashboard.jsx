import React from "react";
import { useState } from "react";
import BuyerDashboardOrders from "./BuyerDashboard/BuyerDashboardOrders";
import BuyerDashboardHeader from "./BuyerDashboard/BuyerDashboardHeader";


function BuyerDashboard() {
    const [activeTab, setActiveTab] = useState("Products");
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
