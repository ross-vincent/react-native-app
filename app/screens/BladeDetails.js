"use strict";
import React, { Component } from "react"
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    SectionList,
    Button
} from "react-native"
import Hr from "../components/Hr"
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
        }, (error) => {
            alert(`Failed to read file:\n${error}`);
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

    displayArray(arrayText) {
        let stringText = "";
        arrayText.forEach((text) => {
            stringText = stringText ? `${stringText}, ${text}` : text;
        });

        return stringText;
    }

    displayBladeData(colText, baseStyle, dlc, ngPlus, flexSize = 1) {
        let style = [baseStyle];
        if (dlc) {
            style.push({color: "deepskyblue"});
        }
        else if (ngPlus) {
            style.push({color: "cornflowerblue"});
        }
        style.push({flex: flexSize});
        return (
            <Text style={style}>{colText.toString()}</Text>
        );
    }

    getBladeDataSections = () => {
        let sections = [];
        this.state.currentBlades.forEach((blade) => {
            sections.push({
                key: blade.name,
                title: blade.name,
                data: [blade]
            });
        });
        return sections;
    };

    renderSectionHeader(section) {
        return (
            this.displayBladeData(section.title, styles.headerText,
                section.data[0].dlc, section.data[0].ngPlus)
        );
    }

    renderItem(item) {
          return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {this.displayBladeData(`Element: ${item.element}`, styles.bladeData,
                        item.dlc, item.ngPlus)}
                    {this.displayBladeData(`Weapon: ${item.weapon}`, styles.bladeData,
                        item.dlc, item.ngPlus, 1.4)}
                </View>

                {item.otherElements.length > 0 && (
                    <View style={styles.container}>
                        {this.displayBladeData(`Other Elements: ${this.displayArray(item.otherElements)}`,
                            styles.bladeData, item.dlc, item.ngPlus)}
                    </View>
                )}
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
                                title={!this.state.filteredDLC ? "Filter DLC blades" : "Unfilter DLC blades"}
                            />
                            <Button
                                onPress={() => this.filterNGPlus()}
                                title={!this.state.filteredNGPlus ? "Filter NG+ blades" : "Unfilter NG+ blades"}
                            />
                        </View>
                        
                        <View style={styles.filters}>
                            <Text style={{color: "deepskyblue"}}>DLC blades</Text>
                            <Text style={{color: "cornflowerblue"}}>NG+ blades</Text>
                        </View>

                        <SectionList
                            sections={this.getBladeDataSections()}
                            renderSectionHeader={({section}) => this.renderSectionHeader(section)}
                            renderItem={({item}) => this.renderItem(item)}
                            renderSectionFooter={() => {return <Hr />}}
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

    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
    },
    
    bladeData: {
        fontSize: 14,
    }
});

export default BladeDetails;