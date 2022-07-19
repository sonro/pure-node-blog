const http = require("http");
const { HttpError } = require("../../src/http/http-error");

/**
 * @param {string?} message
 * @returns {HttpError}
 */
function createCausedError(message = null) {
    const cause = new Error("This error is the cause");
    return HttpError.internalError(cause, message);
}

/**
 * @param {function} testFunction
 */
function runFunctionInDebugEnv(testFunction) {
    process.env.NODE_DEBUG = 1;
    testFunction();
    process.env.NODE_DEBUG = 0;
}

/**
 * @param {int} status
 * @param {string} originalMessage
 * @returns {string}
 */
function createCombinedMessage(status, originalMessage) {
    return `${http.STATUS_CODES[status]}: ${originalMessage}`;
}

exports.createCausedError = createCausedError;
exports.runFunctionInDebugEnv = runFunctionInDebugEnv;
exports.createCombinedMessage = createCombinedMessage;
