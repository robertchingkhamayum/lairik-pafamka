import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./LogoutNavbar.css"

const LogoutNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            try {
                await auth.signOut();
                navigate("/login"); 
            } catch (error) {
                console.error("Logout failed:", error.message);
            }
        }
    };

    return (
        <nav className="logout-navbar">
            <h2>Lairik-Pafamka</h2>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default LogoutNavbar;
