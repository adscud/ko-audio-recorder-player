import React from "react";
import {StyleSheet, Text, View} from "react-native";

export const Header = () => (
    <View>
        <Text style={styles.title}>Proof of concept</Text>
        <Text style={styles.subtitle}>Recording and playing audio</Text>
    </View>
)

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#333333',
        marginTop: 8,
        alignSelf: 'center'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "200",
        alignSelf: 'center',
        color: '#737373'
    }
})
