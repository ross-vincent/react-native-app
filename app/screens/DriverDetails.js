"use strict";
import React, { Component } from "react"
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    SectionList,
    Button,
} from "react-native"
import { getDriverData } from "../data/getDriverData"

class DriverDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        getDriverData()
        .then((data) => {
            let driverData = data;
            this.setState({
                isLoading: false,
                drivers: driverData,
            });
        })

        .catch((error) => {
            alert("Failed to read file:\n" + error);
            this.setState({ isLoading: false });
        });
    }

    bladeSelected(driver, blade) {
        alert("Driver: " + driver + "\nBlade Selected: " + blade);
    }

    getDriverDataSections = () => {
        let sections = [];
        this.state.drivers.forEach((driver) => {
            sections.push({key: driver.name, title: driver.name, data: driver.blades})
        });
        return sections;
    };

    renderSectionHeader(section) {
        return (
            <View style={styles.sectionHeader}>
                <Text style={[styles.colTitle, {flex: 1}]}>{section.title}</Text>
                <Text style={[styles.colTitle, {alignSelf: "flex-start", flex: 1}]}>Blades:</Text>
            </View>
        );
    }

    renderItem(item, section) {
        return (
            <Text
                style={[styles.driverData, {flex: 1}]}
                onPress={() => this.bladeSelected(section.title, item)}
            >
                {item}
            </Text>
        );
    }

    render() {
        return (
            <View style={styles.main}>
                {this.state.isLoading && <ActivityIndicator />}
                {!this.state.isLoading && (
                    <View style={styles.container}>
                        <SectionList
                            sections={this.getDriverDataSections()}
                            renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                            renderItem={({item, section}) => this.renderItem(item, section)}
                            keyExtractor={(item) => item.name}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        margin: 10,
    },
    
    container: {
        flex: 1,
    },
    
    sectionHeader: {
        flex: 1,
        alignItems: "center",
    },

    colTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    
    driverData: {
        fontSize: 16,
        marginBottom: 10,
    }
});

export default DriverDetails;