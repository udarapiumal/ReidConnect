import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CommunityTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>👥 Community interaction</Text>
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
