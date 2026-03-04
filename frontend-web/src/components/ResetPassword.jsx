import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { useNavigate, useSearchParams } from "react-router-dom";
import reidConnectLogo from "../images/ucsc-logo.png";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    // Validate token when page loads
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError("Invalid or missing reset link.");
            return;
        }

        axios.get(`${API_BASE_URL}/auth/validate-reset-token?token=${token}`)
            .then(() => setTokenValid(true))
            .catch(() => {
                setTokenValid(false);
                setError("This reset link is invalid or has expired. Please request a new one.");
            });
    }, [token]);

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                token,
                newPassword,
            });
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err.response?.data || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    <h2 style={styles.subtitle}>Reset Password</h2>
                    <p style={styles.description}>Enter your new password below</p>
                </div>

                {/* Token still being validated */}
                {tokenValid === null && (
                    <p style={styles.validatingText}>Validating your reset link...</p>
                )}

                {/* Token is invalid/expired */}
                {tokenValid === false && (
                    <div style={styles.formContainer}>
                        <p style={styles.errorText}>{error}</p>
                        <button style={styles.button} onClick={() => navigate("/forget-password")}>
                            <i className="fas fa-arrow-left" style={styles.buttonIcon}></i>
                            Request New Link
                        </button>
                    </div>
                )}

                {/* Token is valid — show the form */}
                {tokenValid === true && (
                    <div style={styles.formContainer}>

                        <div style={styles.inputGroup}>
                            <i className="fas fa-lock" style={styles.inputIcon}></i>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <i className="fas fa-lock" style={styles.inputIcon}></i>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        {error && <p style={styles.errorText}>{error}</p>}
                        {message && <p style={styles.successText}>{message}</p>}

                        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
                            <i className="fas fa-key" style={styles.buttonIcon}></i>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                )}
            </div>

            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 ReidConnect Admin Portal. All rights reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    rightSection: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        marginTop: "150px",
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
    },
    reidText: {
        background: "linear-gradient(45deg, #FF0033, #FF6666)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    connectText: {
        background: "linear-gradient(45deg, #FF0033, #FF6666)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#ffffff",
        margin: "8px 0",
    },
    description: {
        fontSize: "14px",
        color: "#b0b0b0",
        margin: "8px 0 0 0",
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
        width: "50%",
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
        margin: "10px 0 10px 70px",
    },
    buttonIcon: {
        fontSize: "16px",
    },
    errorText: {
        color: "#FF4444",
        fontSize: "13px",
        marginBottom: "12px",
        textAlign: "center",
    },
    successText: {
        color: "#44FF88",
        fontSize: "13px",
        marginBottom: "12px",
        textAlign: "center",
    },
    validatingText: {
        color: "#b0b0b0",
        fontSize: "14px",
        textAlign: "center",
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