import { Link, NavLink } from "react-router-dom";
import Button from "./ProductPage/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import APIS from "../../api/api.js";
import axios from "axios";

const Header = ({ search, setSearch }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuth();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (location.pathname !== "/browse") {
            navigate("/browse");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(APIS.LOGOUT, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleAvatarClick = () => {
        if (user && user.id) {
            navigate(`/users/${user.id}`);
        }
    };

    const avatarSrc = user?.avatar || "/avatar.jpg";
    console.log("User avatar:", user?.avatar);
    console.log(user);

    return (
        <header className="bg-[#F9FAFB] shadow py-2">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-1">
                    <div className="flex items-center justify-around w-full">
                        <div className="text-2xl font-bold text-blue-600 w-fit h-fit">
                            <img
                                src="/logo_text.png"
                                alt="Logo"
                                width="80px"
                                height="80px"
                            />
                        </div>

                        <div className="w-full max-w-sm min-w-[200px]">
                            <div className="relative flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                        clipRule="evenodd"
                                    />
                                </svg>

                                <input
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search products..."
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />

                                <Button label={"Submit"} />
                            </div>
                        </div>

                        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    "hover:text-slate-800" +
                                    (isActive
                                        ? " text-slate-800 font-semibold underline"
                                        : "")
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/browse"
                                className={({ isActive }) =>
                                    "hover:text-slate-800" +
                                    (isActive
                                        ? " text-slate-800 font-semibold underline"
                                        : "")
                                }
                            >
                                Browse
                            </NavLink>
                            <NavLink
                                to="/sell"
                                className={({ isActive }) =>
                                    "hover:text-slate-800" +
                                    (isActive
                                        ? " text-slate-800 font-semibold underline"
                                        : "")
                                }
                            >
                                Sell
                            </NavLink>
                            <NavLink
                                to="/aboutus"
                                className={({ isActive }) =>
                                    "hover:text-slate-800" +
                                    (isActive
                                        ? " text-slate-800 font-semibold underline"
                                        : "")
                                }
                            >
                                About Us
                            </NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <img
                            src={avatarSrc}
                            alt="User Avatar"
                            className={`w-10 h-10 rounded-full object-cover border border-slate-300 aspect-square ${user ? "cursor-pointer" : ""}`}
                            loading="lazy"
                            onClick={handleAvatarClick}
                        />
                        {user ? (
                            <Button label={"Logout"} onSubmit={handleLogout} />
                        ) : (
                            <Link to="/login">
                                <Button label={"Login"} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
