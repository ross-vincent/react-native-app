import { readFileAssets } from "react-native-fs"
import { getBladeData } from "./app/data/getBladeData"
import { getDriverData } from "./app/data/getDriverData"

jest.mock("react-native-fs", () => {
    return {
        readFileAssets: jest.fn()
    }
});

describe("Get blade data", () => {
    test("loads an empty csv file", async() => {
        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve("");
            })
        });
    
        const data = await getBladeData();
        expect(data.length).toBe(0);
    });

    test("loads one line of csv data", async() => {
        const csvData = "Bob,1,2,F,F,None";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getBladeData();
        expect(data.length).toBe(1);
        expect(data[0].name).toBe("Bob");
        expect(data[0].element).toBe("1");
        expect(data[0].weapon).toBe("2");
        expect(data[0].dlc).toBe(false);
        expect(data[0].ngPlus).toBe(false);
        expect(data[0].otherElements).toEqual([]);
    });

    test("loads csv data with 'dlc' not set to 'F'", async() => {
        const csvData = "Bob,,,T,,";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getBladeData();
        expect(data[0].dlc).toBe(true);
    });

    test("loads csv data with non-None 'otherElements'", async() => {
        const csvData = "Bob,,,,,1:2:3";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getBladeData();
        expect(data[0].otherElements).toEqual(["1", "2", "3"]);
    });

    test("loads three lines of csv data", async() => {
        const csvData =
            "Bob,,1,,,\n" +
            "Betty,,2,,,\n" +
            "Fred,,3,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getBladeData();
        expect(data.length).toBe(3);
        expect(data[0].name).toBe("Bob");
        expect(data[0].weapon).toBe("1");
        expect(data[1].name).toBe("Betty");
        expect(data[1].weapon).toBe("2");
        expect(data[2].name).toBe("Fred");
        expect(data[2].weapon).toBe("3");
    });

    test("skips empty lines in the csv", async() => {
        const csvData = 
        "Bob,,,,,\n" +
        "\n" +
        "Fred,,,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getBladeData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[1].name).toBe("Fred");
    });

    test("skips lines with no first entry in the csv", async() => {
        const csvData = 
        "Bob,,,,,\n" +
        ",,,,,\n" +
        "Fred,,,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getBladeData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[1].name).toBe("Fred");
    });

    test("skips lines starting with 'Name'", async() => {
        const csvData = 
        "Name,,,,,\n" +
        "Bob,,,,,\n" +
        "Fred,,,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getBladeData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[1].name).toBe("Fred");
    });
});

describe("Get driver data", () => {
    test("loads an empty csv file", async() => {
        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve("");
            })
        });
    
        const data = await getDriverData();
        expect(data.length).toBe(0);
    });

    test("loads one line of csv data", async() => {
        const csvData = "Bob,1,2,3,4,5,6,7,8";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getDriverData();
        expect(data.length).toBe(1);
        expect(data[0].name).toBe("Bob");
        expect(data[0].blades).toEqual(["1","2","3","4","5","6","7","8"]);
    });

    test("skips empty columns in a line", async() => {
        const csvData = "Bob,1,2,,4,5,";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getDriverData();
        expect(data[0].blades.length).toBe(4);
        expect(data[0].blades).toEqual(["1","2","4","5"]);
    });

    test("loads three lines of csv data", async() => {
        const csvData =
            "Bob,1,2\n" +
            "Betty,3,4\n" +
            "Fred,5,6\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });
    
        const data = await getDriverData();
        expect(data.length).toBe(3);
        expect(data[0].name).toBe("Bob");
        expect(data[0].blades).toEqual(["1","2"]);
        expect(data[1].name).toBe("Betty");
        expect(data[1].blades).toEqual(["3","4"]);
        expect(data[2].name).toBe("Fred");
        expect(data[2].blades).toEqual(["5","6"]);
    });

    test("skips empty lines in the csv", async() => {
        const csvData = 
        "Bob,,,\n" +
        "\n" +
        "Fred,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getDriverData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[1].name).toBe("Fred");
    });

    test("skips lines with no first entry in the csv", async() => {
        const csvData = 
        "Bob,,,\n" +
        ",,,\n" +
        "Fred,,,\n";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getDriverData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[1].name).toBe("Fred");
    });

    test("skips lines starting with 'Driver' and 'Unused'", async() => {
        const csvData = 
        "Driver,1,2\n" +
        "Bob,3,4\n" +
        "Fred,5,6\n" +
        "Unused,7,8";

        readFileAssets.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(csvData);
            })
        });

        const data = await getDriverData();
        expect(data.length).toBe(2);
        expect(data[0].name).toBe("Bob");
        expect(data[0].blades).toEqual(["3","4"]);
        expect(data[1].name).toBe("Fred");
        expect(data[1].blades).toEqual(["5","6"]);
    });
});