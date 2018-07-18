"use strict";
import React from "react"
import { createMaterialTopTabNavigator } from "react-navigation"
import BladeDetails from "../screens/BladeDetails"
import DriverDetails from "../screens/DriverDetails"

export const Tabs = createMaterialTopTabNavigator(
    {
        BladeDetails1: {
            screen: BladeDetails,
        },
        DriverDetails: {
            screen: DriverDetails,
        },
        BladeDetails3: {
            screen: BladeDetails,
        },
        BladeDetails4: {
            screen: BladeDetails,
        },
        BladeDetails5: {
            screen: BladeDetails,
        },
    },

    // Config
    {
        tabBarOptions: {
            scrollEnabled: true,
        }
    }
);