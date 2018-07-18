"use strict";
import React, { Component } from "react"
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    SectionList,
} from "react-native"
import Hr from "../components/Hr"
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
                selectedDrivers: [],
                selectedBlades: [],
            });
        }, (error) => {
            alert(`Failed to read file:\n${error}`);
            this.setState({ isLoading: false });
        });
    }

    bladeSelected(driver, blade) {
        /*
        let selectedDrivers = this.state.selectedDrivers;
        if (selectedDrivers.length > 2 && !selectedDrivers.includes(driver)) {
            alert(`All 3 drivers have been selected`);
        }
        else if (selectedDrivers.includes(driver)) {

        }
        else {
            selectedDrivers.push(driver);
        };
        */
        let selectedBlades = this.state.selectedBlades;
        if (selectedBlades.includes(blade)) {
            alert(`${blade} is already selected`);
        }
        else if (selectedBlades.length > 8) {
            alert(`All 9 blades have been selected`);
        }
        else {
            selectedBlades.push(blade);
            this.setState({
                selectedBlades: selectedBlades
            })
            alert(`Selected Blades: ${selectedBlades}`);
        }
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
                <Text style={[styles.headerText, {flex: 1}]}>{section.title}</Text>
                <Text style={[styles.headerText, {alignSelf: "flex-start", flex: 1}]}>Blades:</Text>
            </View>
        );
    }

    renderItem(item, section) {
        return (
            <Text
                style={[styles.driverData, {flex: 1}]}
                onPress={() => this.bladeSelected(section.title, item)}
            >{item}</Text>
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
                            ItemSeparatorComponent={() => {return <Hr />}}
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

    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
    },
    
    driverData: {
        fontSize: 16,
    }
});

export default DriverDetails;