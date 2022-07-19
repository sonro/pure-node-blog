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
     * Raw request body string
     * @type {string}
     */
    requestBody = "";

    /**
     * Data object from request body
     * @type {object}
     */
    requestData = {};

    /**
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;

        let data = "";
        this.request.on("data", (chunk) => (data += chunk));
        this.request.on("end", () => {
            this.requestBody = data;
            this.requestData = dataFromRequestBody(request, data);
        });
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
        return isRequestJson(this.request);
    }

    /**
     * Write data as into JSON response
     * @param {Object} data
     */
    json(data) {
        this.response.setHeader("Content-Type", HTTP_JSON_TYPE);
        const body = JSON.stringify(data);
        this.response.write(body);
    }
}

/**
 * @param {http.IncomingMessage} req
 * @returns {boolean}
 */
function isRequestJson(req) {
    return req.headers["content-type"] === HTTP_JSON_TYPE;
}

/**
 * @param {http.IncomingMessage} req
 * @param {string} body
 * @param {Object}
 */
function dataFromRequestBody(req, body) {
    const reqIsJson = isRequestJson(req);
    if (reqIsJson) {
        return JSON.parse(body);
    }
    return {};
}

exports.HttpMessage = HttpMessage;
