const http = require("http");

const HTTP_JSON_TYPE = "application/json";

/**
 * HTTP request and response message
 */
class HttpMessage {
    /**
     * @type {http.IncomingMessage}
     */
    request;

    /**
     * @type {http.ServerResponse}
     */
    response;

    /**
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    /**
     * Does the request ask for JSON?
     * @returns {boolean}
     */
    wantsJson() {
        return this.request.headers.accept === HTTP_JSON_TYPE;
    }

    /**
     * Is the request body JSON?
     * @returns {boolean}
     */
    isJson() {
        return this.request.headers["content-type"] === HTTP_JSON_TYPE;
    }
}

exports.HttpMessage = HttpMessage;
