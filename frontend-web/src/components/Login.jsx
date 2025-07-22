import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            const { token } = res.data;
            const decoded = jwtDecode(token);

            if (decoded.role !== "union" && decoded.role !== "academic") {
                alert("Access denied: Unauthorized role");
                return;
            }

            localStorage.setItem("token", token);
            alert("Login successful!");

            if (decoded.role === "union") {
                navigate("/union/dashboard");
            } else if (decoded.role === "academic") {
                navigate("/academic/dashboard");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert("Login failed: " + (err.response?.data?.message || err.message));
            } else {
                alert("Login failed: Try again later.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            <input
                type="email"
                placeholder="Enter Your E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>
                Login
            </button>
            <p style={styles.redirectText}>
                Don't have an account? <a href="/signup" style={styles.link}>Sign up</a>
            </p>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "5rem auto",
        padding: "2rem",
        backgroundColor: "#151718",
        borderRadius: "10px",
        color: "#ffffff",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "30px",
        textAlign: "center",
        color: "#ffffff",
    },
    input: {
        width: "100%",
        height: "50px",
        border: "1.5px solid #444",
        borderRadius: "10px",
        padding: "0 15px",
        marginBottom: "15px",
        backgroundColor: "#1A1A1A",
        fontSize: "16px",
        color: "#ffffff",
    },
    button: {
        width: "100%",
        height: "50px",
        backgroundColor: "#FF0033",
        color: "#ffffff",
        fontWeight: "bold",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    redirectText: {
        marginTop: "20px",
        textAlign: "center",
        color: "#cccccc",
    },
    link: {
        color: "#FF0033",
        fontWeight: "bold",
        textDecoration: "none",
    },
};
