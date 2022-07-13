const http = require("http");
const { ServiceContainer } = require("./service/container.js");
const { HttpMessage } = require("./http/http-message.js");

/**
 * @param {int} port
 * @param {ServiceContainer} container
 * @param {function} callback
 * @returns {http.Server} The HTTP Server
 */
function runServer(port, container, callback) {
    const server = createHttpServer(container);
    server.listen(port, callback);
    return server;
}

/**
 * Setup and create the HTTP server for web access of the app.
 * @param {ServiceContainer} container
 * @returns {http.Server} A HTTP Server
 */
function createHttpServer(container) {
    const _options = {};
    return http.createServer(_options, (request, response) => {
        const message = new HttpMessage(request, response);
        handleRequest(message, container);
    });
}

/**
 * Handle every web server request
 * @param {HttpMessage} message
 * @param {ServiceContainer} container
 */
function handleRequest(message, container) {
    // guarantee the server's response is ready to be sent
    if (message.response.writable) {
        message.response.end();
    }

    logRequest(message.request, message.response, container.logger);
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
