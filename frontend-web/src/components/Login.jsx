import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import reidConnectLogo from "../images/ucsc-logo.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayText, setDisplayText] = useState("");
    const navigate = useNavigate();
    
    const fullText = "Welcome to ReidConnect Admin Portal";
    
    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);
        
        return () => clearInterval(timer);
    }, []);

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
        <>
            <style>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>
            <div style={styles.pageContainer}>
                <div style={styles.leftSection}>
                    <div style={styles.animatedTextContainer}>
                        <h1 style={styles.animatedText}>
                            {displayText}
                            <span style={styles.cursor}>|</span>
                        </h1>
                        <p style={styles.welcomeSubtext}>
                            Secure, Professional, Efficient Management System
                        </p>
                    </div>
                </div>
                
                <div style={styles.rightSection}>
                    <div style={styles.loginCard}>
                        <div style={styles.logoContainer}>
                            <img src={reidConnectLogo} alt="ReidConnect" style={styles.logo} />
                        </div>
                        <div style={styles.headerContainer}>
                                <h1 style={styles.mainTitle}>
                                    <span style={styles.reidText}>Reid</span>
                                    <span style={styles.connectText}>Connect</span>
                                </h1> 
                                <h2 style={styles.subtitle}>Admin Portal</h2>
                            <p style={styles.description}>Secure access to administration dashboard</p>
                        </div>
                        
                        <div style={styles.formContainer}>
                            <div style={styles.inputGroup}>
                                <i className="fas fa-envelope" style={styles.inputIcon}></i>
                                <input
                                    type="email"
                                    placeholder="Admin Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <i className="fas fa-lock" style={styles.inputIcon}></i>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            
                            <button onClick={handleLogin} style={styles.button}>
                                <i className="fas fa-sign-in-alt" style={styles.buttonIcon}></i>
                                Sign In to Dashboard
                            </button>
                            
                            <div style={styles.divider}>
                                <span style={styles.dividerText}>Admin Access Only</span>
                            </div>
                            
                            <p style={styles.redirectText}>
                                Need access? <a href="/contact" style={styles.link}>Contact IT Support</a>
                            </p>
                        </div>
                    </div>
                    
                    <footer style={styles.footer}>
                        <p style={styles.footerText}>© 2025 ReidConnect Admin Portal. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}

const styles = {
    pageContainer: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        display: "flex",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    leftSection: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
    },
    rightSection: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    animatedTextContainer: {
        textAlign: "center",
        maxWidth: "600px",
    },
    animatedText: {
        fontSize: "48px",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "20px",
        lineHeight: "1.2",
        textShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "-0.02em",
    },
    cursor: {
        animation: "blink 1s infinite",
        color: "#FF0033",
        fontSize: "48px",
    },
    welcomeSubtext: {
        fontSize: "18px",
        color: "#b0b0b0",
        fontWeight: "400",
        lineHeight: "1.6",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "0.01em",
    },
    loginCard: {
        maxWidth: "400px",
        width: "100%",
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        borderRadius: "20px",
        padding: "35px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        border: "1px solid #333",
        position: "relative",
        overflow: "hidden",
    },
    logoContainer: {
        textAlign: "center",
        marginBottom: "20px",
    },
    logo: {
        width: "120px",
        height: "auto",
        filter: "drop-shadow(0 4px 8px rgba(255, 0, 51, 0.3))",
    },
    headerContainer: {
        textAlign: "center",
        marginBottom: "40px",
    },
    mainTitle: {
        fontSize: "32px",
        fontWeight: "700",
        margin: "10px 0",
        background: "linear-gradient(45deg, #FF0033, #FF6666)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 2px 4px rgba(255, 0, 51, 0.3)",
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#ffffff",
        margin: "8px 0",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    },
    description: {
        fontSize: "14px",
        color: "#b0b0b0",
        margin: "8px 0 0 0",
        fontWeight: "400",
    },
    formContainer: {
        width: "100%",
    },
    inputGroup: {
        position: "relative",
        marginBottom: "20px",
    },
    inputIcon: {
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#666",
        fontSize: "16px",
        zIndex: 1,
    },
    input: {
        width: "100%",
        height: "55px",
        border: "2px solid #333",
        borderRadius: "12px",
        padding: "0 15px 0 45px",
        backgroundColor: "#1a1a1a",
        fontSize: "16px",
        color: "#ffffff",
        outline: "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        height: "55px",
        background: "linear-gradient(45deg, #FF0033, #FF6666)",
        color: "#ffffff",
        fontWeight: "600",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        boxShadow: "0 4px 15px rgba(255, 0, 51, 0.3)",
        marginTop: "10px",
    },
    buttonIcon: {
        fontSize: "16px",
    },
    divider: {
        margin: "30px 0 20px 0",
        textAlign: "center",
        position: "relative",
    },
    dividerText: {
        color: "#666",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: "500",
        backgroundColor: "#1e1e1e",
        padding: "0 15px",
        position: "relative",
        zIndex: 1,
    },
    redirectText: {
        textAlign: "center",
        color: "#b0b0b0",
        fontSize: "14px",
        margin: "0",
    },
    link: {
        color: "#FF0033",
        fontWeight: "600",
        textDecoration: "none",
        transition: "color 0.3s ease",
    },
    footer: {
        marginTop: "30px",
        textAlign: "center",
    },
    footerText: {
        color: "#666",
        fontSize: "11px",
        margin: "0",
    },
};
