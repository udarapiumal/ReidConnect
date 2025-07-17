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

            // Save token (replace AsyncStorage with localStorage in web)
            localStorage.setItem("token", token);
            alert("Login successful!");

            // Navigate based on role
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
                placeholder="Email"
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
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "5rem"
    },
    title: {
        textAlign: "center",
        marginBottom: "1.5rem"
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "1rem",
        borderRadius: "6px",
        border: "1.5px solid #ccc",
        fontSize: "16px"
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};