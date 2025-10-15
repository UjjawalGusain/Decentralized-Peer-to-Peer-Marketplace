import React from "react";
import { useState } from "react";

import SellerDashboardHeader from "./SellerDashboard/SellerDashboardHeader";
import SellerDashboardProducts from "./SellerDashboard/SellerDashboardProducts";
import SellerDashboardPayouts from "./SellerDashboard/SellerDashboardPayouts";
import SellerDashboardPayments from "./SellerDashboard/SellerDashboardPayments";

function SellerDashboard() {
    const [activeTab, setActiveTab] = useState("Products");
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12 relative overflow-visible">
            <h1 className="text-4xl font-bold font-inter text-[#FEC010] mb-6 relative z-10">
                Your Activity Dashboard!
            </h1>

            <SellerDashboardHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div>
                {activeTab === "Products" && <SellerDashboardProducts />}
                {activeTab === "Payments" && <SellerDashboardPayments />}
                {activeTab === "Payouts" && <SellerDashboardPayouts />}
            </div>
        </div>
    );
}

export default SellerDashboard;
