import React from "react";
import "../pages/Style.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="home-container">
                <h2>Welcome to Our Study Hub</h2>
                <p>
                    Book your study slots easily and enjoy a peaceful study environment.  
                    Whether you're preparing for exams or need a quiet place to focus,  
                    we've got you covered!
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
