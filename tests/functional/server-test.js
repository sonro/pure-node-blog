const assert = require("assert");
const http = require("http");
const { runServer } = require("../../src/server.js");
const { ServiceContainer } = require("../../src/service/container.js");
const { ErrorPageGenerator } = require("../../src/service/error-page-generator.js");
const { Logger } = require("../../src/service/logger.js");
const { HTML_ERROR_TEMPLATE } = require("../utility/http-error.js");

const TEST_PORT = 3003;
const TEST_HOST = "localhost";

exports.testDefaultRoute = async () => {
    const res = await testReq("GET", "/");
    assertStatusOk(res);
};

/**
 * @param {http.IncomingMessage} res
 */
function assertStatusOk(res) {
    assert.equal(
        res.statusCode,
        200,
        `Response statusCode: ${res.statusCode} should be 200`
    );
}

/**
 * Send a request to the application's server
 *
 * Create a test version of the server, send the caller's request to it,
 * shut down the test server, return the response.
 *
 * @async
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @returns {Promise<http.IncomingMessage>} Server's response
 */
function testReq(method, path) {
    return runOnTestServer(() => {
        const options = {
            hostname: TEST_HOST,
            port: TEST_PORT,
            path: path,
            method: method,
            headers: {},
        };
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => resolve(res));
            req.on("error", (err) => reject(err));
            req.end();
        });
    });
}

/**
 * Start a server, run a function, and then stop the server.
 * @param {function} testFunction - Must return a Promise
 * @returns {Promise<any>}
 */
async function runOnTestServer(testFunction) {
    const server = await startTestServer();
    const res = await testFunction();
    server.close();
    return res;
}

/**
 * Start a test version of the application's server
 * @returns {Promise<http.Server>}
 */
function startTestServer() {
    const logger = Logger.empty();
    const generator = new ErrorPageGenerator(HTML_ERROR_TEMPLATE);
    const container = new ServiceContainer(logger, generator);
    return new Promise((resolve, reject) => {
        const server = runServer(TEST_PORT, container, () => resolve(server));
        server.on("error", (err) => reject(err));
    });
}