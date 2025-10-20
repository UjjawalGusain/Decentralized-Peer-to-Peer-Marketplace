import React from "react";

const SellerDashboardHeader = ({ activeTab, setActiveTab }) => {
  const tabs = ["Products", "Payments", "Payouts"];

  return (
    <div className="border-b pb-2 mb-6 overflow-x-auto">
      <div className="flex space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-24">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-b-4 border-[#FEC010] text-slate-900"
                : "text-gray-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboardHeader;
