import React from "react";

const BuyerDashboardHeader = ({ activeTab, setActiveTab }) => {
  const tabs = ["Orders"];

  return (
    <div className="flex space-x-52 border-b pb-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 text-lg font-medium transition-colors ${
            activeTab === tab
              ? "border-b-4 border-[#FEC010] text-slate-900"
              : "text-gray-500 hover:text-slate-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default BuyerDashboardHeader;
