import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setIsLoading(true);

        try {
            console.log("Sending login request...");
            const res = await axios.post("http://10.21.84.107:8080/auth/login", { email, password });
            console.log("Login response:", res.data);
            const { token, role } = res.data;
            Alert.alert("Success", "Login successful!");

            // ✅ Save token securely
            await AsyncStorage.setItem("token", token);

            // Decode token to check role
            const decoded = jwtDecode(token);

            // ✅ Redirect based on embedded role
            switch (decoded.role) {
                case "student":
                    router.push("/student/");
                    break;
                case "club":
                    router.push("/club/dashboard");
                    break;
                default:
                    Alert.alert("Error", "Unknown role");
            }
        } catch (err) {
            console.log("Login error:", err);
            if (axios.isAxiosError(err)) {
                Alert.alert("Login failed", JSON.stringify(err.response?.data || err.message));
            } else {
                Alert.alert("Login failed", "Try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            emailFocused && styles.inputFocused
                        ]}
                        placeholder="Email Address"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        textContentType="emailAddress"
                    />
                    
                    <TextInput
                        style={[
                            styles.input,
                            passwordFocused && styles.inputFocused
                        ]}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        textContentType="password"
                    />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.loginButtonText}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>
                        Don't have an account?{' '}
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#151718',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#2a2a2a',
        fontSize: 16,
        color: '#ffffff',
    },
    inputFocused: {
        borderColor: '#FF0033',
        borderWidth: 2,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#FF0033',
        fontSize: 14,
    },
    loginButton: {
        height: 50,
        backgroundColor: '#FF0033',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#666',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
    dividerText: {
        color: '#888',
        paddingHorizontal: 15,
        fontSize: 14,
    },
    signUpContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    signUpText: {
        color: '#888',
        fontSize: 14,
    },
    signUpLink: {
        color: '#FF0033',
        fontWeight: 'bold',
    },
});