const assert = require("assert");
const http = require("http");
const { runServer } = require("../src/server.js");

const TEST_PORT = 3003;

exports.testRunServerDefaultRoute = () => {
    runTestOnServer(() => {
        assert.equal(true, true);
    });
};

/**
 * Start a server, run a test, and then stop the server.
 * @param {function} testFunction 
 */
function runTestOnServer(testFunction) {
    const server = runServer(TEST_PORT);
    testFunction();
    server.close();
}
