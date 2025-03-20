import React from "react";
import "../components/NavbarFooter.css"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (  
        <nav>
            <h2 >
                <Link to="/"> Lairik-Pafamka </Link> 
            </h2>
            <div>
                <Link to="/"> Home </Link>
                <Link to="/about"> About </Link>
                <Link to="/gallery"> Gallery </Link>
                <Link to="/login"> Login </Link>
            </div>
        </nav>
    );
};

export default Navbar;
