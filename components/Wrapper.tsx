import React from "react";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView, StyleSheet} from "react-native";

interface WrapperProps {
    children: JSX.Element
}

export const Wrapper = (props: WrapperProps) => (
    <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {props.children}
    </SafeAreaView>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
})
