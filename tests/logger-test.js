const path = require("path");
const os = require("os");
const fs = require("fs");
const assert = require("assert");
const { Logger } = require("../src/logger.js");

exports.testLogToFile = async () => {
    const tempFile = createTempFile();
    const stream = fs.createWriteStream(tempFile);
    const logger = new Logger(stream);
    const msg = "This is a test message";
    await logger.log(msg);
    assertFileContainsString(tempFile, msg);
};

exports.testLogToStdout = async () => {
    const logger = new Logger(process.stdout);
    const msg = "This is a test message";
    await logger.log(msg);
    assertStdoutContainsString(msg);
};

/**
 * @returns {string} The path to the temporary file
 */
function createTempFile() {
    const filePath = path.join(os.tmpdir(), "pnb.test.log");
    // Make sure file is empty
    fs.writeFileSync(filePath, "");
    return filePath;
}

/**
 * @param {string} filePath
 * @param {string} str
 */
function assertFileContainsString(filePath, str) {
    const contents = fs.readFileSync(filePath, "utf8");
    assert(
        contents.includes(str),
        `File ${filePath} does not contain string: ${str}`
    );
}

/**
 * @param {string} str
 */
function assertStdoutContainsString(str) {
    const contents = process.stdout.read(); 
    assert(contents.includes(str), `Stream does not contain string: ${str}`);
}
