const { ServiceContainer } = require("../service/container");
const { HttpMessage } = require("./http-message");
const path = require("path");
const { handleError } = require("./error");
const { HttpError } = require("./http-error");

const API_ROUTE_PREFIX = "/api";

/**
 * @param {HttpMessage} message
 * @param {ServiceContainer} container
 */
async function routeRequest(message, container) {
    try {
        const isApiRequest = message.request.url.startsWith(API_ROUTE_PREFIX);
        if (isApiRequest) {
            await routeApi(message, container);
        } else {
            routePublic(message, container);
        }
    } catch (err) {
        handleError(err, message, container.errorPageGenerator);
    }
}

/**
 * Route every API request
 * @param {HttpMessage} message
 * @param {ServiceContainer} container
 */
async function routeApi(message, container) {}

/**
 * Route every public request
 * @param {HttpMessage} message
 * @param {ServiceContainer} container
 */
function routePublic(message, container) {
    let url = message.request.url.toLowerCase();
    if (url.endsWith("/")) {
        url += "index.html";
    }
    const resolvedPath = path.resolve(url);
    const contents = container.publicAssets[resolvedPath];
    if (contents) {
        const ext = path.extname(url);
        message.response.setHeader(
            "Content-Type",
            EXT_MAP[ext] || "text/plain"
        );
        message.response.end(contents);
    } else {
        throw HttpError.notFound(message.request.url);
    }
}

const EXT_MAP = {
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
};

exports.routeRequest = routeRequest;
