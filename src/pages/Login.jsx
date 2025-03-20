import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem("currentUser", JSON.stringify({ uid: user.uid, email: user.email }));

            navigate("/bookyourslot");
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login-page">
                <h3>Login</h3>
                
                <div className="input-container">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-container">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleLogin}>Login</button>
                
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
