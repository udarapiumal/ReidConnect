import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import {router} from "expo-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        try {
            console.log("Sending login request...");
            const res = await axios.post("http://localhost:8080/auth/login", { email, password });
            console.log("Login response:", res.data);

            // Check for token in response
            if (res.data && res.data.token) {
                // Store the token for future use
                const { token, expiresIn } = res.data;

                // You can store in AsyncStorage or SecureStore here
                console.log("Token received:", token);
                console.log("Expires in:", expiresIn, "milliseconds");

                Alert.alert("Success", "Login successful!");
                router.replace('/');

                // Navigate to next screen or update app state
                // navigation.navigate('Home');

            } else {
                Alert.alert("Error", "Login failed - no token received");
            }

        } catch (err) {
            console.log("Login error:", err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    Alert.alert("Login Failed", "Invalid email or password");
                } else {
                    Alert.alert("Login Failed", err.response?.data?.message || err.message);
                }
            } else {
                Alert.alert("Login Failed", "An unexpected error occurred");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                textContentType="emailAddress"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                textContentType="password"
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },
});