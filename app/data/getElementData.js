"use strict";
import fs from "react-native-fs"

const dataFile = "XC2 Data - Element Details.csv";

function readCSV(filename) {
    return new Promise((resolve, reject) => {
        fs.readFileAssets(filename, "utf8")
        .then((data) => {
            let elements = [];
            let lines = data.split("\n");

            lines.forEach((line) => {
                line = line.replace(/\r/g, "");
                if (line.length > 0 && line.charAt(0) !== ",") {
                    let cols = line.split(",");
                    let element = {
                        name: cols[0],
                        weakness: cols[1],
                        seal: cols[2],
                        combos: cols[3].split(":"),
                    };
                    elements.push(element);
                };
            });
            resolve(elements);
        }, (error) => {
            reject(error);
        });
    });
}

export function getElementData() {
    return readCSV(dataFile);
};