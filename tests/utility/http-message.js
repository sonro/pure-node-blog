const http = require("http");
const { Socket } = require("net");
const { HttpMessage } = require("../../src/http/http-message");

const APPLICATION_JSON = "application/json";

class TestMessageOptions {
    /** @type {string} */
    path = "/";
    /** @type {Object} */
    queryParams = {};
    /** @type {string} */
    method = "GET";
    /** @type {string} */
    accept = "*/*";
    /** @type {string?} */
    body = null;
    /** @type {string?} */
    reqType = null;
    /** @type {string?} */
    resType = null;
}

const DEFAULT_TEST_MESSAGE_OPTIONS = new TestMessageOptions();

/**
 * @param {TestMessageOptions} options
 * @returns {HttpMessage}
 */
function createTestMessage(options = {}) {
    options = Object.assign({}, DEFAULT_TEST_MESSAGE_OPTIONS, options);
    const socket = new Socket();
    const req = new http.IncomingMessage(socket);
    applyOptionsToRequest(options, req);
    const res = new http.ServerResponse(req);
    applyOptionsToResponse(options, res);

    const message = new HttpMessage(req, res);
    if (options.body) {
        req.emit("data", options.body);
        req.emit("end");
    }
    return message;
}

/**
 * @param {Object} data
 * @returns {HttpMessage}
 */
function createTestMessagePostJson(data) {
    options = new TestMessageOptions();
    options.accept = APPLICATION_JSON;
    options.reqType = APPLICATION_JSON;
    options.resType = APPLICATION_JSON;
    options.method = "POST";
    options.body = JSON.stringify(data);
    return createTestMessage(options);
}

/**
 * @param {HttpMessage} message 
 * @returns {Object}
 */
function getResponseDataFromJsonMessage(message) {
    const body = getResponseBodyFromMessage(message);
    return JSON.parse(body);
}

/**
 * @param {HttpMessage} message 
 * @returns {string}
 */
function getResponseBodyFromMessage(message) {
    const res = message.response.outputData[0].data;
    const doubleLine = "\r\n\r\n";
    const bodyIndex = res.indexOf(doubleLine) + doubleLine.length;
    return res.substring(bodyIndex);
}

/**
 * @param {TestMessageOptions} options
 * @param {http.IncomingMessage} req
 */
function applyOptionsToRequest(options, req) {
    req.url = urlFromOptions(options);
    req.method = options.method;
    req.headers.accept = options.accept;
    if (options.reqType) {
        req.headers["content-type"] = options.reqType;
    }
}

/**
 * @param {TestMessageOptions} options
 * @param {http.ServerResponse} res
 */
function applyOptionsToResponse(options, res) {
    if (options.resType) {
        res.setHeader("Content-Type", options.resType);
    }
}

/**
 * Create URL string from path and query params
 * @param {TestMessageOptions} options
 * @returns {string}
 */
function urlFromOptions(options) {
    let url = options.path;
    const params = Object.entries(options.queryParams);
    if (params.length) {
        url += "?";
        const endIndex = params.length - 1;
        params.forEach(([key, value], index) => {
            if (value !== undefined && value !== null) {
                url += `${key}=${value}`;
            } else {
                url += key;
            }
            if (index < endIndex) {
                url += "&";
            }
        });
    }

    return url;
}

exports.createTestMessage = createTestMessage;
exports.createTestMessageJson = createTestMessagePostJson;
exports.TestMessageOptions = TestMessageOptions;
exports.getResponseDataFromJsonMessage = getResponseDataFromJsonMessage;
exports.getResponseBodyFromMessage = getResponseBodyFromMessage;