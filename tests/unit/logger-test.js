const path = require("path");
const os = require("os");
const fs = require("fs");
const assert = require("assert");
const { Logger } = require("../../src/logger.js");
const Stream = require("stream");

exports.testLogToFile = async () => {
    const tempFile = createTempFile();
    const stream = fs.createWriteStream(tempFile);
    const msg = await createLoggerAndLogMessage(stream);
    assertFileContainsString(tempFile, msg);
};

exports.testLogToStream = async () => {
    const stream = new TestStream();
    const msg = await createLoggerAndLogMessage(stream);
    assertTestStreamContainsString(stream, msg);
};

exports.testLogToFileAndStream = async () => {
    const tempFile = createTempFile();
    const fileStream = fs.createWriteStream(tempFile);
    const testStream = new TestStream();
    const msg = await createLoggerAndLogMessage(fileStream, testStream);
    assertFileContainsString(tempFile, msg);
    assertTestStreamContainsString(testStream, msg);
}

exports.testEmptyLoggerWorks = () => {
    const logger = Logger.empty();
    logger.log("test");
}

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
 * Readable and Writable stream for log testing
 * @extends Stream
 */
class TestStream extends Stream {
    constructor() {
        super();
        this.buffer = "";
        this.stream = new Stream.Writable();
        this.stream._write = (chunk, encoding, next) => {
            this.buffer += chunk.toString();
            next();
        };
    }

    /**
     * @returns {string}
     */
    read() {
        return this.buffer;
    }

    /**
     * @param {string} msg 
     * @param {function} callback
     */
    write(msg, callback) {
        this.stream.write(msg, callback);
    }
}

/**
 * @param {...Stream} streams
 * @returns {string}
 */
async function createLoggerAndLogMessage(...streams) {
    const logger = new Logger(...streams);
    const msg = "This is a test message";
    await logger.log(msg);
    return msg;
}

/**
 * @param {string} filePath
 * @param {string} str
 */
function assertFileContainsString(filePath, str) {
    const contents = fs.readFileSync(filePath, "utf8");
    assertStringContains(str, contents);
}

/**
 * @param {TestStream} testStream
 * @param {string} str
 */
function assertTestStreamContainsString(testStream, str) {
    const contents = testStream.read();
    assertStringContains(str, contents);
}

/**
 * @param {string} expected 
 * @param {string} actual 
 */
function assertStringContains(expected, actual) {
    assert(
        actual.includes(expected),
        `Stream does not contain the correct string`
    );
}