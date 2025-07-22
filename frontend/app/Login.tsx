import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { BASE_URL } from '../constants/config';

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
            const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            console.log("Login response:", res.data);

            const { token, role } = res.data;
            Alert.alert("Success", "Login successful!");

            // Save token securely
            await AsyncStorage.setItem("token", token);

            // Decode token to check role
            const decoded = jwtDecode(token);

            // Redirect based on embedded role
            switch (decoded.role) {
                case "student":
                    router.push("/student");
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
            
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require("../assets/images/reidConnect.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    
                    <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                styles.input,
                                emailFocused && styles.inputFocused
                            ]}
                            placeholder="Email Address"
                            placeholderTextColor="#71717A"
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
                            placeholderTextColor="#71717A"
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
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Sign Up Option */}
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionText}>Don't have an account?</Text>
                        <TouchableOpacity 
                            onPress={() => router.push('/Signup')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    headerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    logoContainer: {
        marginBottom: 32,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    logo: {
        width: 80,
        height: 80,
    },
    welcomeTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#A1A1AA',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
        fontWeight: '400',
    },
    formSection: {
        paddingBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 54,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    inputFocused: {
        borderColor: '#FF453A',
        borderWidth: 2,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#FF453A',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#FF453A',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 32,
        shadowColor: '#FF453A',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    loginButtonDisabled: {
        backgroundColor: '#52525B',
        shadowOpacity: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        color: '#71717A',
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        gap: 6,
    },
    optionText: {
        color: '#71717A',
        fontSize: 14,
        fontWeight: '400',
    },
    linkText: {
        color: '#FF453A',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        paddingBottom: 24,
    },
    footerText: {
        color: '#52525B',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
        maxWidth: 300,
        alignSelf: 'center',
    },
});