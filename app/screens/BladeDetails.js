"use strict";
import React, { Component } from "react"
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Button
} from "react-native"
import { getBladeData } from "../data/getBladeData"

class BladeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        getBladeData()
        .then((data) => {
            let bladeData = data.sort(function(a, b){return a.name.localeCompare(b.name)})
            this.setState({
                isLoading: false,
                blades: bladeData,
                currentBlades: bladeData,
                filteredDLC: false,
                filteredNGPlus: false
            });
        })

        .catch((error) => {
            alert("Failed to read file:\n" + error);
            this.setState({ isLoading: false });
        });
    }

    filterDLC() {
        let newBlades = [];
        let dlcBlades = [];
        
        if (!this.state.filteredDLC) {
            newBlades = this.state.currentBlades.filter(function(blade){return !blade.dlc});
        }
        else {
            newBlades = this.state.currentBlades;
            dlcBlades = this.state.blades.filter(function(blade){return blade.dlc});
            newBlades = newBlades.concat(dlcBlades);
        };

        this.setState({
            currentBlades: newBlades.sort(function(a, b){return a.name.localeCompare(b.name)}),
            filteredDLC: !this.state.filteredDLC
        });
    }

    filterNGPlus() {
        let newBlades = [];
        let ngPlusBlades = [];
        
        if (!this.state.filteredNGPlus) {
            newBlades = this.state.currentBlades.filter(function(blade){return !blade.ngPlus});
        }
        else {
            newBlades = this.state.currentBlades;
            ngPlusBlades = this.state.blades.filter(function(blade){return blade.ngPlus});
            newBlades = newBlades.concat(ngPlusBlades);
        };

        this.setState({
            currentBlades: newBlades.sort(function(a, b){return a.name.localeCompare(b.name)}),
            filteredNGPlus: !this.state.filteredNGPlus
        });
    }

    headerCol(colText, flexSize = 1) {
        return <Text style={[styles.colTitle, {flex: flexSize}]}>{colText}</Text>;
    }

    bladeCol(colText, dlc, ngPlus, flexSize = 1) {
        let fontColour = "grey";
        if (dlc) {
            fontColour = "deepskyblue";
        }
        else if (ngPlus) {
            fontColour = "cornflowerblue";
        }

        return (
            <Text style={[styles.bladeData, {flex: flexSize, color: fontColour}]}>{colText.toString()}</Text>
        );
    }

    renderItem(item) {
        return (
            <View style={styles.row}>
                {this.bladeCol(item.name, item.dlc, item.ngPlus)}
                {this.bladeCol(item.element, item.dlc, item.ngPlus)}
                {this.bladeCol(item.weapon, item.dlc, item.ngPlus, 1.4)}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.main}>
                {this.state.isLoading && <ActivityIndicator />}
                {!this.state.isLoading && (
                    <View style={styles.container}>
                        <View style={styles.filters}>
                            <Button
                                onPress={() => this.filterDLC()}
                                title={!this.state.filteredDLC? "Filter DLC blades" : "Unfilter DLC blades"}
                            />
                            <Button
                                onPress={() => this.filterNGPlus()}
                                title={!this.state.filteredNGPlus? "Filter NG+ blades" : "Unfilter NG+ blades"}
                            />
                        </View>
                        
                        <View style={styles.filters}>
                            <Text style={{color: "deepskyblue"}}>DLC blades</Text>
                            <Text style={{color: "cornflowerblue"}}>NG+ blades</Text>
                        </View>
                        
                        <View style={styles.row}>
                            {this.headerCol("Name")}
                            {this.headerCol("Element")}
                            {this.headerCol("Weapon", 1.4)}
                        </View>
                        <FlatList
                            data={this.state.currentBlades}
                            renderItem={({item}) => this.renderItem(item)}
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
    
    bladeData: {
        fontSize: 14,
    }
});

export default BladeDetails;