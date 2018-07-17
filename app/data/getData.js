"use strict";
import fs from "react-native-fs"

const dataFile = "XC2 Data - Blade Details.csv";

function readCSV(filename) {
    return new Promise((resolve, reject) => {
        fs.readFileAssets(filename, "utf8")
        .then((data) => {
            let blades = [];
            let lines = data.split("\n");
        
            lines.forEach(line => {
                line = line.replace(/\r/g, "");
                if (line.length > 0 && !line.startsWith("Name")) {
                    let cols = line.split(",");
                    let blade = {
                        name: cols[0],
                        element: cols[1],
                        weapon: cols[2],
                        dlc: cols[3] !== "F",
                        ngPlus: cols[4] !== "F",
                        otherElements: cols[5] !== "None"? cols[5].split(":") : [],
                    };
                    blades.push(blade);
                };
            });
            resolve(blades);
        })

        .catch((error) => {
            reject(error);
        });
    });
}

export function getData() {
    return readCSV(dataFile);
};