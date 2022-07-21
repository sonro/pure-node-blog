const http = require("http");
const { HttpError } = require("../../src/http/http-error");

const HTML_ERROR_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{title}}</title>
  </head>
  <body>
    <h1>{{message}}</h1>
  </body>
</html>`;

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
exports.HTML_ERROR_TEMPLATE = HTML_ERROR_TEMPLATE;