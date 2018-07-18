"use strict";
import fs from "react-native-fs"

const dataFile = "XC2 Data - Driver Details.csv";

function readLine(cols) {
    let blades = [];
    cols.forEach((col, index) => {
        if (index !== 0 && col.length > 0) {
            blades.push(col);
        }
    });
    return blades;
}

function readCSV(filename) {
    return new Promise((resolve, reject) => {
        fs.readFileAssets(filename, "utf8")
        .then((data) => {
            let drivers = [];
            let otherRexBlades = [];
            let allDriverBlades = [];
            let lines = data.split("\n");

            lines.forEach(line => {
                line = line.replace(/\r/g, "");
                if (line.length > 0 && !line.startsWith("Driver") && !line.startsWith("Unused")) {
                    let cols = line.split(",");
                    if (line.startsWith("Any")) {
                        allDriverBlades = readLine(cols);
                    }
                    else {
                        let bladeNames = readLine(cols);
                        let driver = {
                            name: cols[0],
                            blades: bladeNames,
                        };

                        if (driver.name !== "Rex" && driver.name !== "Tora") {
                            otherRexBlades = otherRexBlades.concat(bladeNames);
                        }
                        drivers.push(driver);
                    };
                };
            });

            drivers.forEach(driver => {
                if (driver.name === "Rex") {
                    driver.blades = driver.blades.concat(otherRexBlades);
                }
                if (driver.name !== "Tora") {
                    driver.blades = driver.blades.concat(allDriverBlades);
                }
            });
            resolve(drivers);
        })

        .catch((error) => {
            reject(error);
        });
    });
}

export function getDriverData() {
    return readCSV(dataFile);
};