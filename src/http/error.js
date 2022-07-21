const { HttpMessage } = require("./http-message");
const { HttpError } = require("./http-error");
const { ErrorPageGenerator } = require("../service/error-page-generator");

/**
 * @param {HttpError|Error} error
 * @param {HttpMessage} message
 * @param {ErrorPageGenerator} generator
 */
function handleError(error, message, generator) {
    if (error instanceof HttpError === false) {
        error = HttpError.internalError(error);
    }

    message.response.statusCode = error.status;

    if (message.isJson() || message.wantsJson()) {
        writeJsonError(error, message);
    } else {
        writeHtmlError(error, message, generator);
    }

    message.response.end();
}

/**
 * @param {HttpError} error
 * @param {HttpMessage} httpMessage
 */
function writeJsonError(error, httpMessage) {
    httpMessage.json({
        message: error.message,
    });
}

/**
 * @param {HttpError} error
 * @param {HttpMessage} httpMessage
 * @param {ErrorPageGenerator} generator
 */
function writeHtmlError(error, httpMessage, generator) {
    const html = generator.generate(error);
    httpMessage.response.write(html);
}

exports.handleError = handleError;
