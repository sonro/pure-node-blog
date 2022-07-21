const assert = require("assert");
const http = require("http");
const { handleError } = require("../../../src/http/error");
const { HttpError } = require("../../../src/http/http-error");
const { HttpMessage } = require("../../../src/http/http-message");
const {
    ErrorPageGenerator,
} = require("../../../src/service/error-page-generator");
const {
    createCombinedMessage,
    runFunctionInDebugEnv,
    HTML_ERROR_TEMPLATE,
} = require("../../utility/http-error");
const {
    createTestMessageJson,
    getResponseDataFromJsonMessage,
    createTestMessage,
    getResponseBodyFromMessage,
} = require("../../utility/http-message.js");

exports.testBadRequestJson = () => {
    const message = createTestMessageJson({});
    const reason = "Property missing: name";
    const error = HttpError.badRequest(reason);

    handleError(error, message);
    const expected = createCombinedMessage(error.status, reason);
    assertStatusAndMessageJson(message, error.status, expected);
};

exports.testNotFoundHtml = () => {
    const path = "/test-path";
    const options = {
        path: path,
    };
    const message = createTestMessage(options);
    const error = HttpError.notFound(path);
    const generator = createGenerator();

    handleError(error, message, generator);
    const expected = createCombinedMessage(error.status, path);
    assertStatusAndMessageHtml(message, error.status, expected);
};

exports.testDirectInternalErrorJson = () => {
    const message = createTestMessageJson({});
    const error = new Error("This is an internal error");
    const status = 500;

    handleError(error, message);
    const expected = http.STATUS_CODES[status];
    assertStatusAndMessageJson(message, status, expected);
};

exports.testDirectInternalErrorDebugJson = () => {
    const message = createTestMessageJson({});
    const errMsg = "This is an internal error";
    const error = new Error(errMsg);
    const status = 500;

    runFunctionInDebugEnv(() => {
        handleError(error, message);
        const expected = createCombinedMessage(status, errMsg);
        assertStatusAndMessageJson(message, status, expected);
    });
};

/**
 * @param {HttpMessage} httpMessage
 * @param {int} status
 * @param {string} errorMessage
 */
function assertStatusAndMessageJson(httpMessage, status, errorMessage) {
    assert.equal(httpMessage.response.statusCode, status);
    const data = getResponseDataFromJsonMessage(httpMessage);
    assert(data.message);
    assert.equal(data.message, errorMessage);
}

/**
 * @param {HttpMessage} httpMessage
 * @param {int} status
 * @param {string} errorMessage
 */
function assertStatusAndMessageHtml(httpMessage, status, errorMessage) {
    assert.equal(httpMessage.response.statusCode, status);
    const html = getResponseBodyFromMessage(httpMessage);

    const title = getTagInnerText(html, "title");
    const expectedTitle = `${status} ${http.STATUS_CODES[status]}`;
    assert.equal(title, expectedTitle);

    const body = getTagInnerText(html, "body");
    assert(body.includes(errorMessage));
}

/**
 * @param {string} document
 * @param {string} tag
 * @returns {string}
 */
function getTagInnerText(document, tag) {
    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const openIndex = document.indexOf(openTag) + openTag.length;
    const closeIndex = document.indexOf(closeTag);
    return document.substring(openIndex, closeIndex);
}

/**
 * @returns {ErrorPageGenerator}
 */
function createGenerator() {
    return new ErrorPageGenerator(HTML_ERROR_TEMPLATE);
}
