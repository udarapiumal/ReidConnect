import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function VenueTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Book Venues</Text>
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
