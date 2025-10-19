import React from "react";
import { useState } from "react";
import ErrorPage from "./ErrorPages/ErrorPage";
import SellerDashboardHeader from "./SellerDashboard/SellerDashboardHeader";
import SellerDashboardProducts from "./SellerDashboard/SellerDashboardProducts";
import SellerDashboardPayouts from "./SellerDashboard/SellerDashboardPayouts";
import SellerDashboardPayments from "./SellerDashboard/SellerDashboardPayments";
import { useAuth } from "../context/AuthContext";

function SellerDashboard() {
    const {user} = useAuth();

    if (!user) return <ErrorPage message={"Sorry you have not logged in so you don't have access to this page."}/>;

    if (!user.roles.includes("seller")) return <ErrorPage message={"We don't think you have the access to sell. Please update your roles from your profile."}/>;
    const [activeTab, setActiveTab] = useState("Products");
    return (
        <div className="min-h-full bg-gray-50 flex flex-col items-center px-6 py-12 relative overflow-visible">
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
