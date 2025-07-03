import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AnalyticsTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>📈 Analytics will appear here</Text>
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
