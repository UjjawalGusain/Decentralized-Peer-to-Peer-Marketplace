import React, { createContext, useContext, useState, useEffect } from "react";
import APIS from "../../api/api";
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User object
    const [token, setToken] = useState(null); // JWT token

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }, [token, user]);

    // Login function: set token and user info
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    };

    // Logout function: clear token and user info
    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const refreshUser = async (id) => {
        if (!token || !id) return; 

        try {
            const response = await fetch(`${APIS.USERS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to refresh user");
            const freshUser = await response.json();
            setUser(freshUser);
        } catch (error) {
            console.error("User refresh failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
