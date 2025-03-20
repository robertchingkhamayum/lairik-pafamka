import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../pages/Style.css";

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="about-container">
                <h2>About Our Study Hub</h2>
                <p>
                    Our mission is to provide students with a comfortable and distraction-free  
                    study space. With easy online booking, you can reserve your spot and focus  
                    on what truly matters—learning!
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default About;
