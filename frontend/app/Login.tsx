import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }
        try {
            console.log("Sending login request...");
            const res = await axios.post("http://localhost:8080/auth/login", { email, password });
            console.log("Login response:", res.data);
            const { token, role } = res.data;
            Alert.alert("Success", "Login successful!");

            // ✅ Save token securely
            await AsyncStorage.setItem("token", token);

            // Decode token to check role
            const decoded: any = jwtDecode(token);

            // ✅ Redirect based on embedded role
            switch (decoded.role) {
                case "student":
                    router.push("/student/dashboard");
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
