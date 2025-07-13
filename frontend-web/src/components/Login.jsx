import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- Add this

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // <-- Add this

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }
        try {
            console.log("Sending login request...");
            const res = await axios.post("http://localhost:8080/auth/login", { email, password });
            console.log("Login response:", res.data);
            alert("Login successful!");
            navigate("/search"); // <-- Navigate to SearchUser page
        } catch (err) {
            console.log("Login error:", err);
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
            <button onClick={handleLogin} style={styles.button}>Login</button>
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
