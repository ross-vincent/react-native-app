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
            alert("Failed to read file" + error);
            this.setState({ isLoading: false });
        });
    }

    getDriverDataSections = () => {
        let sections = [];
        this.state.drivers.forEach((driver) => {
            sections.push({title: driver.name, data: driver.blades})
        });
        return sections;
    }

    render() {
        function headerCol(colText, flexSize = 1) {
            return <Text style={[styles.colTitle, {flex: flexSize}]}>{colText}</Text>;
        }

        function driverCol(colText, flexSize = 1) {
            return <Text style={[styles.driverData, {flex: flexSize}]}>{colText}</Text>;
        }

        return (
            <View style={styles.main}>
                {this.state.isLoading && <ActivityIndicator />}
                {!this.state.isLoading && (
                    <View style={styles.container}>
                        <SectionList
                            renderItem={({item, index, section}) => (
                                <Text style={[styles.driverData, {flex: 1}]}>{item}</Text>
                            )}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={styles.colTitle}>{title}</Text>
                            )}
                            sections={this.getDriverDataSections()}
                            keyExtractor={(item, index) => item.name}
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
    
    filters: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 10,
    },
    
    row: {
        flexDirection: "row",
    },
    
    colTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    
    driverData: {
        fontSize: 14,
    }
});

export default DriverDetails;