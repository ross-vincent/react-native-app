"use strict";
import fs from "react-native-fs"

// filename
const dataFile = "XC2 Data - Blade Details.csv";

/**
 * Reads in the data from the csv passed in. The data from each line is used to
 * create a blade object. The blades are added to an array and this is returned
 * once the file has been read.
 */
function readCSV(filename) {
    return new Promise((resolve, reject) => {
        fs.readFileAssets(filename, "utf8")
        .then((data) => {
            let blades = [];
            let lines = data.split("\n");

            lines.forEach((line) => {
                line = line.replace(/\r/g, "");
                // Skips invalid lines.
                if (line.length > 0 && line.charAt(0) !== "," && !line.startsWith("Name")) {
                    let cols = line.split(",");
                    let blade = {
                        name: cols[0],
                        element: cols[1],
                        weapon: cols[2],
                        dlc: cols[3] !== "F", // true or false
                        ngPlus: cols[4] !== "F", // true or false
                        otherElements: cols[5] !== "None" ? cols[5].split(":") : [], // array of elements or empty
                    };
                    blades.push(blade);
                };
            });
            resolve(blades);
        }, (error) => {
            reject(error);
        });
    });
}

/**
 * Gets blade data from a csv. Passes in the filename of the file to be read, so
 * the filename doesn't need to be set elsewhere.
 */
export function getBladeData() {
    return readCSV(dataFile);
};