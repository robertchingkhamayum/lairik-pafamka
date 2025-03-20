import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, "users/" + user.uid), {
                fullName: fullName,
                email: email,
                userId: user.uid
            });

            alert("Sign Up Successful!");
            navigate("/login");  
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="signup-page">
                <h2>Sign Up</h2>

                <div className="input-container">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSignUp}>Sign Up</button>

                <p>
                    Already have an account?{" "}
                    <span 
                        onClick={() => navigate("/login")} 
                        className="link-text"
                    >
                        Login
                    </span>
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default SignUp;
