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
import { getElementData } from "../data/getElementData"

class ElementDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        getElementData()
        .then((data) => {
            let elementData = data;
            this.setState({
                isLoading: false,
                elements: elementData,
            });
        }, (error) => {
            alert("Failed to read file:\n" + error);
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <View style={styles.main}>
                {this.state.isLoading && <ActivityIndicator />}
                {!this.state.isLoading && (
                    <View style={styles.container}>
                        <SectionList
                            sections={this.getElementDataSections()}
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

    colTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    
    elementData: {
        fontSize: 14,
    }
});

export default ElementDetails;