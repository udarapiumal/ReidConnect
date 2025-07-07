import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EarnTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>💰 Earn content here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#aaaaaa",
        fontSize: 16,
    },
});
