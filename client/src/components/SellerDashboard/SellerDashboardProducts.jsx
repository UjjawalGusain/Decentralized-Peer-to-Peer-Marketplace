import React from "react";
import { useNavigate } from "react-router-dom";

function SellerDashboardProducts() {
    const navigate = useNavigate();

    const handleViewItem = (productId) => {
        navigate(`/browse/${productId}`);
    };
    return <div>SellerDashboardProducts</div>;
}

export default SellerDashboardProducts;
