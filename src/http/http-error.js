const http = require("http");

/**
 * Error for HTTP response
 */
class HttpError extends Error {
    /**
     * HTTP status code
     * @type {int}
     */
    status;

    /**
     * @param {int} status - HTTP status code
     * @param {Error?} cause
     * @param {string?} message
     */
    constructor(status = 500, cause = null, message = null) {
        const validCodes = Object.keys(http.STATUS_CODES);
        if (validCodes.includes(status.toString()) == false) {
            throw new Error(`Invalid HTTP status code ${status}`);
        }
        message = createMessage(status, cause, message);
        super(message, { cause: cause });
        this.status = status;
    }

    /**
     * 500: Internal Server Error
     * @param {Error} [cause] - optional
     * @param {string} [message] - optional
     * @returns {HttpError}
     */
    static internalError(cause = null, message = null) {
        if (typeof cause === "string") {
            return new HttpError(500, null, cause);
        }
        return new HttpError(500, cause, message);
    }

    /**
     * 404: Not Found
     * @param {string} resource
     * @returns {HttpError}
     */
    static notFound(resource) {
        return new HttpError(404, null, resource);
    }

    /**
     * 405: Method Not Allowed
     * @param {string} method
     * @returns {HttpError}
     */
    static methodNotAllowed(method) {
        return new HttpError(405, null, method);
    }

    /**
     * 400: Bad Request
     * @param {string?} reason
     */
    static badRequest(reason = null) {
        return new HttpError(400, null, reason);
    }
}

/**
 * @param {int} status
 * @param {Error?} cause
 * @param {string?} message
 */
function createMessage(status, cause = null, message = null) {
    if (status >= 500) {
        // internal server error
        // only relay message/cause if node is in debug mode
        const DEBUG = process.env.NODE_DEBUG == 1;
        message = DEBUG ? createDebugMessage(cause, message) : null;
    }

    return httpMessageFromStatus(status, message);
}

/**
 * @param {Error?} cause
 * @param {string?} message
 * @returns {string?}
 */
function createDebugMessage(cause = null, message = null) {
    if (cause && message) {
        return `${message}: ${cause.message}`;
    }
    if (message) {
        return message;
    }
    if (cause) {
        return cause.message;
    }
    return null;
}

/**
 * @param {int} status
 * @param {string?} message
 */
function httpMessageFromStatus(status, message = null) {
    let output = http.STATUS_CODES[status];
    if (message) {
        output = `${output}: ${message}`;
    }

    return output;
}

module.exports = HttpError;
