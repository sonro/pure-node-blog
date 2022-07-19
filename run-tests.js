const fs = require("fs");
const path = require("path");

/**
 * Run all tests and print negative results
 */
async function main() {
    let filter = null;
    if (process.argv.length == 3) {
        filter = process.argv[2];
    }

    const suites = loadTestSuites();
    const fails = [];
    console.log("Running tests");

    for (const suite of suites) {
        for (const [name, test] of Object.entries(suite.tests)) {
            if (filter && name != filter) {
                continue;
            }
            try {
                await test();
                logSuccess();
            } catch (err) {
                logFail();
                const fail = new Fail(suite.name, name, err);
                fails.push(fail);
            }
        }
    }

    process.stdout.write("\n\n");

    for (const fail of fails) {
        fail.print();
    }

    process.exit(fails.length);
}

/**
 * Load all test suite files from the tests directory
 *
 * Test files must be named "*-test.js"
 *
 * @returns {Array<TestSuite>} An array of test suites
 */
function loadTestSuites() {
    const suffix = "-test.js";
    return getAllFilePaths("./tests")
        .filter((file) => file.endsWith(suffix))
        .map((file) => new TestSuite(file, suffix));
}

/**
 * Print a notification of success to stdout
 */
function logSuccess() {
    process.stdout.write(".");
}

/**
 * Print a notification of failure to stdout
 */
function logFail() {
    process.stdout.write("F");
}

/**
 * A test failure
 */
class Fail {
    /**
     * @param {string} suiteName
     * @param {string} testName
     * @param {Error} error thrown by the test
     */
    constructor(suiteName, testName, error) {
        this.name = formatTestName(suiteName, testName);
        this.err = error;
    }

    /**
     * Print information about the failed test
     */
    print() {
        console.log(`${this.name} -> Failed`);
        console.log(this.err.message);
        process.stdout.write("\n");
    }
}

/**
 * Set of exported tests in a single file
 */
class TestSuite {
    /**
     * Name of the test suite
     * @type {string} 
     */
    name;

    /**
     * Tests to run
     * @type {Array<function>} 
     */
    tests;

    /**
     * @param {string} filePath
     * @param {string} suffix to remove from the file name
     */
    constructor(filePath, suffix) {
        const testDir = __dirname + "/tests/";
        const suffixIndex = filePath.indexOf(suffix);
        this.name = filePath
            .substring(testDir.length, suffixIndex)
            .toUpperCase();
        this.tests = require(filePath);
    }
}

/**
 * Recursively get all files in a directory
 *
 * @param {string} dirPath
 * @param {Array<string>} files
 * @returns {Array<string>} All file paths in the given directory
 */
function getAllFilePaths(dirPath, files = []) {
    dirfiles = fs.readdirSync(dirPath);

    for (const file of dirfiles) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            files = getAllFilePaths(dirPath + "/" + file, files);
        } else {
            files.push(path.join(__dirname, dirPath, "/", file));
        }
    }

    return files;
}

/**
 * Format test function name to be more readable
 * @param {string} name
 */
function formatTestName(suite, name) {
    // remove "test" from the start of the name
    let testName = name.slice(4);
    // separate camel case words with a space
    testName = testName.replace(/([A-Z])/g, " $1");
    // make lowercase
    testName = testName.toLowerCase();
    // insert suite name
    testName = `${suite}:${testName}`;

    return testName;
}

main();
