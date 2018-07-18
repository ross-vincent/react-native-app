"use strict";
import React from "react"
import { View } from "react-native"

const Hr = ({ margin = 5 }) => {
    return (
        <View style={{
            borderBottomColor: "lightgrey",
            borderBottomWidth: 1,
            marginTop: margin,
            marginBottom: margin,
        }} />
    );
};

export default Hr;