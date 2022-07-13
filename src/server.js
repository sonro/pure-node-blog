const http = require("http");
const Logger = require("./logger.js");

/**
 * @param {int} port
 * @param {Logger} logger
 * @param {function} callback
 * @returns {http.Server} The HTTP Server
 */
function runServer(port, logger, callback) {
    const server = createHttpServer(logger);
    server.listen(port, callback);
    return server;
}

/**
 * Setup and create the HTTP server for web access of the app.
 * @param {Logger} logger
 * @returns {http.Server} A HTTP Server
 */
function createHttpServer(logger) {
    const _options = {};
    return http.createServer(_options, (request, response) => {
        handleRequest(request, response, logger);
    });
}

/**
 * Handle every web server request
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @param {Logger} logger
 */
function handleRequest(request, response, logger) {
    response.end();
    logRequest(request, response, logger) 
}

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @param {Logger} logger
 */
function logRequest(request, response, logger) {
    const date = new Date().toISOString();
    const status = response.statusCode;
    const method = request.method;
    const url = request.url;
    const ip = request.socket.remoteAddress;
    logger.log(`${date} ${status} ${method} ${url} ${ip}`);
}

exports.runServer = runServer;
exports.handleRequest = handleRequest;
