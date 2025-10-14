import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import APIS from "../../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./ProductPage/Button.jsx";

const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-semibold mb-4 border-l-4 border-[#FEC010] pl-3 text-slate-900">
        {children}
    </h2>
);

function UserProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSellerDashboard = () => {
        navigate("sellerdashboard");
    }

    const handleProfileEdit = () => {
        navigate("update");
    };

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const response = await fetch(`${APIS.USERS}/${id}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    if (!user) return null;
    else console.log(user);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Header */}
                <div className="flex items-center gap-6 mb-10">
                    <img
                        src={
                            user.profile.avatar ||
                            "https://via.placeholder.com/100?text=No+Avatar"
                        }
                        alt={user.profile.name}
                        className="w-24 h-24 rounded-full shadow-md object-cover"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">
                            {user.profile.name}
                        </h1>
                        <p className="text-gray-700 mt-1">{user.email}</p>
                        <p className="mt-2 text-sm text-gray-600">
                            Roles: {user.roles.join(", ")}
                        </p>
                    </div>
                </div>

                {/* Reputation Section */}
                <section className="bg-white p-6 rounded-md shadow-sm">
                    <SectionTitle>Reputation</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 text-gray-800 text-lg">
                        <div>
                            <span className="font-medium text-slate-700">
                                Score
                            </span>
                            <p>{user.profile.reputation?.score ?? 0}</p>
                        </div>
                        <div>
                            <span className="font-medium text-slate-700">
                                Total Transactions
                            </span>
                            <p>
                                {user.profile.reputation?.totalTransactions ??
                                    0}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-slate-700">
                                Average Rating
                            </span>
                            <p>
                                {user.profile.reputation?.averageRating?.toFixed(
                                    1
                                ) ?? 0}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Location Section */}
                {user.profile.location && user.profile.location.country && user.profile.location.city && (
                    <section className="bg-white p-6 rounded-md shadow-sm">
                        <SectionTitle>Location</SectionTitle>
                                <p>
                                    Country: {user.profile.location.country},
                                    City: {user.profile.location.city}
                                </p>
                    </section>
                )}

                {token && (
                    <Button
                        label={"Edit my profile"}
                        onSubmit={handleProfileEdit}
                    />
                )}

                {token && user.roles.includes("seller") && (
                    <Button
                        label={"Seller Dashboard"}
                        color={"bg-[#FEC010]"} 
                        onSubmit={handleSellerDashboard}
                    />
                )}
            </main>
        </div>
    );
}

export default UserProfilePage;
