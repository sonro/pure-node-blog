const http = require("http");
const ServiceContainer = require("./service/container.js");
const HttpMessage = require("./http/http-message.js");
const { routeRequest } = require("./http/route.js");

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
        request.on("end", () => handleRequest(message, container));
    });
}

/**
 * Handle every web server request
 * @param {HttpMessage} message
 * @param {ServiceContainer} container
 */
async function handleRequest(message, container) {
    const date = new Date();
    await routeRequest(message, container);

    // guarantee the server's response is ready to be sent
    if (message.response.writable) {
        message.response.end();
    }

    logRequest(message.request, message.response, container.logger, date);
}

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @param {Logger} logger
 * @param {Date} date
 */
function logRequest(request, response, logger, date) {
    date = date.toISOString();
    const status = response.statusCode;
    const method = request.method;
    const url = request.url;
    const ip = request.socket.remoteAddress;
    logger.log(`${date} [${status}] [${method}] ${url} ${ip}`);
}

module.exports = {
    runServer,
    handleRequest,
};
