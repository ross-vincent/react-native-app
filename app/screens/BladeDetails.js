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

/**
 * Lists the details for blades from a csv and provides buttons to filter the
 * blades that are dlc or ng+.
 */
class BladeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        // Gets data for the blades from a csv.
        getBladeData()
        .then((data) => {
            // Data sorted alphabetically by name. The blade data is stored twice
            // so one can filtered while still having access to all the data.
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

    /**
     * Adds or removes the dlc blades from those displayed, based on whether they
     * are currently filtered.
     */
    filterDLC() {
        let newBlades = [];
        
        if (!this.state.filteredDLC) {
            newBlades = this.state.currentBlades.filter(function(blade){return !blade.dlc});
        }
        else {
            newBlades = this.state.currentBlades;
            let dlcBlades = this.state.blades.filter(function(blade){return blade.dlc});
            newBlades = newBlades.concat(dlcBlades);
        };

        this.setState({
            currentBlades: newBlades.sort(function(a, b){return a.name.localeCompare(b.name)}),
            filteredDLC: !this.state.filteredDLC
        });
    }

    /**
     * Adds or removes the ng+ blades from those displayed, based on whether
     * they are currently filtered.
     */
    filterNGPlus() {
        let newBlades = [];
        
        if (!this.state.filteredNGPlus) {
            newBlades = this.state.currentBlades.filter(function(blade){return !blade.ngPlus});
        }
        else {
            newBlades = this.state.currentBlades;
            let ngPlusBlades = this.state.blades.filter(function(blade){return blade.ngPlus});
            newBlades = newBlades.concat(ngPlusBlades);
        };

        this.setState({
            currentBlades: newBlades.sort(function(a, b){return a.name.localeCompare(b.name)}),
            filteredNGPlus: !this.state.filteredNGPlus
        });
    }

    /**
     * Returns an array as a string with comma space separated items.
     * An empty array returns an empty string.
     */
    displayArray(arrayText) {
        let stringText = "";
        arrayText.forEach((text) => {
            stringText = stringText ? `${stringText}, ${text}` : text;
        });

        return stringText;
    }

    /**
     * Adds to the style of the text to change font colour if it is a dlc or
     * ng+ blade or add a custom flex size.
     */
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

    /**
     * Creates the array of section objects for the blade section list.
     */
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

    /**
     * Creates the section headers for the blade section list.
     * Displays the blade's name.
     */
    renderSectionHeader(section) {
        return (
            this.displayBladeData(section.title, styles.headerText,
                section.data[0].dlc, section.data[0].ngPlus)
        );
    }

    /**
     * Sets the format for how to display the data for each blade in the blade
     * section list. Displays the attributes of each blade other than their name.
     * 'Other elements' are shown only if the blade has any.
     */
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

    /**
     * There are buttons to filter the data at the top of the page with a colour
     * key below. The blade data is shown under this as a section list. Each
     * section header is the name of the blade and their other details are shown
     * within the section.
     */
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