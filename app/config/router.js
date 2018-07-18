"use strict";
import React from "react"
import { createMaterialTopTabNavigator } from "react-navigation"
import BladeDetails from "../screens/BladeDetails"
import DriverDetails from "../screens/DriverDetails"

export const Tabs = createMaterialTopTabNavigator(
    {
        BladeDetails: {
            screen: BladeDetails,
            navigationOptions: {
                tabBarLabel: "Blade Details",
            },
        },
        DriverDetails: {
            screen: DriverDetails,
            navigationOptions: {
                tabBarLabel: "Driver Details",
            },
        },
        Screen3: {
            screen: BladeDetails,
        },
        Screen4: {
            screen: DriverDetails,
        },
        Screen5: {
            screen: BladeDetails,
        },
    },

    // Config
    {
        tabBarOptions: {
            scrollEnabled: true,
        },
    }
);