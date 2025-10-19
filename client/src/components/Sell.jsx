import React, { useEffect, useState } from "react";
import SellForm from "./Sell/SellForm";
import Button from "./ProductPage/Button";
import { useAuth } from "../context/AuthContext";
import ErrorPage from "./ErrorPages/ErrorPage";
import { useForm } from "react-hook-form";

function Sell() {
    const { user } = useAuth();


    if (!user) return <ErrorPage message={"Sorry you have not logged in so you don't have access to this page."}/>;

    if (!user.roles.includes("seller")) return <ErrorPage message={"We don't think you have the access to sell. Please update your roles from your profile."}/>;

    return (
        user.roles.includes("seller") && (
            <div className="min-h-full bg-gray-50 font-inter flex flex-col items-center px-4 py-12 relative overflow-visible">
                <main className="w-full max-w-3xl mx-auto rounded-xl shadow-xl py-8 px-6 relative z-10 border border-yellow-50">
                    <h1 className="text-4xl font-bold text-center text-[#FEC010] mb-8 font-inter">
                        Let's post an ad for you!
                    </h1>
                    <SellForm />
                </main>
            </div>
        )        
    );
}

export default Sell;
