import { Link, NavLink } from "react-router-dom";
import Button from "./ProductPage/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import APIS from "../../api/api.js";
import axios from "axios";
import { useState } from "react";

const Header = ({ search, setSearch }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

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
                headers: { Authorization: `Bearer ${token}` },
            });
            logout();
            navigate("/login");
            setMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleAvatarClick = () => {
        if (user && user.id) {
            navigate(`/users/${user.id}`);
            setMenuOpen(false);
        }
    };

    const avatarSrc = user?.profile?.avatar || "/avatar.jpg";

    return (
        <header className="bg-[#F9FAFB] shadow py-2">
            <div className="max-w-[70rem] mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-1">
                    {/* Logo + Search */}
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="text-2xl font-bold text-blue-600 w-fit h-fit">
                            <img
                                src="/logo_text.png"
                                alt="Logo"
                                width="80"
                                height="80"
                            />
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 min-w-[150px] max-w-sm">
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
                                <Button label="Submit" />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex gap-6 text-sm text-gray-600 items-center">
                        {[
                            "/",
                            "/browse",
                            "/sell",
                            "/aboutus",
                            "/chat",
                            "/demo",
                        ].map((path, idx) => {
                            const label = [
                                "Home",
                                "Browse",
                                "Sell",
                                "About Us",
                                "Messages",
                                "Demo",
                            ][idx];
                            return (
                                <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                        "hover:text-slate-800" +
                                        (isActive
                                            ? " text-slate-800 font-semibold underline"
                                            : "")
                                    }
                                >
                                    {label}
                                </NavLink>
                            );
                        })}

                        {/* Desktop Login / Logout */}
                        {user ? (
                            <Button label="Logout" onSubmit={handleLogout} />
                        ) : (
                            <Link to="/login">
                                <Button label="Login" />
                            </Link>
                        )}

                        {/* Desktop Avatar */}
                        <img
                            src={avatarSrc}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-slate-300 aspect-square cursor-pointer"
                            loading="lazy"
                            onClick={handleAvatarClick}
                        />
                    </nav>

                    {/* Mobile Hamburger + Avatar */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Mobile Avatar */}
                        <img
                            src={avatarSrc}
                            alt="User Avatar"
                            className={`w-10 h-10 rounded-full object-cover border border-slate-300 aspect-square cursor-pointer`}
                            loading="lazy"
                            onClick={handleAvatarClick}
                        />

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={
                                        menuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <nav className="flex flex-col mt-2 gap-2 lg:hidden text-gray-700">
                        {[
                            "/",
                            "/browse",
                            "/sell",
                            "/aboutus",
                            "/chat",
                            "/demo",
                        ].map((path, idx) => {
                            const label = [
                                "Home",
                                "Browse",
                                "Sell",
                                "About Us",
                                "Messages",
                                "Demo",
                            ][idx];
                            return (
                                <NavLink
                                    key={path}
                                    to={path}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        "py-2 px-3 rounded hover:bg-gray-100" +
                                        (isActive
                                            ? " font-semibold underline text-gray-900"
                                            : "")
                                    }
                                >
                                    {label}
                                </NavLink>
                            );
                        })}

                        {/* Mobile Login / Logout */}
                        <div className="mt-2 px-3 flex flex-col gap-2">
                            {user ? (
                                <Button
                                    label="Logout"
                                    onSubmit={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                />
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Button label="Login" />
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
