const assert = require("assert");
const http = require("http");
const { HttpError } = require("../../../src/http/http-error");
const errorUtil = require("../../utility/http-error");

exports.testNewHttpErrorEmptyIsInternalError = () => {
    const error = new HttpError();
    assertErrorStatusAndMessage(error, 500);
};

exports.testNewHttpErrorInvalidStatus = () => {
    [0, 50, 199, 250, 590, 600].forEach((status) => {
        assert.throws(
            () => new HttpError(status),
            `Invalid HTTP code ${status} should throw an Error`
        );
        try {
            new HttpError(status);
        } catch (err) {
            assert(
                err.message.includes(status),
                "Thrown Error should include the invalid HTTP status code"
            );
        }
    });
};

exports.testNewHttpErrorStatusAndMessage = () => {
    Object.keys(http.STATUS_CODES).forEach((status) => {
        const error = new HttpError(status);
        assertErrorStatusAndMessage(error, status);
    });
};

exports.testInternalErrorDefault = () => {
    defaultInternalErrorTest();
};

exports.testInternalErrorDefaultDebug = () => {
    errorUtil.runFunctionInDebugEnv(defaultInternalErrorTest);
};

exports.testInternalErrorCause = () => {
    const error = errorUtil.createCausedError();
    assertErrorStatusAndMessage(error, 500);
};

exports.testInternalErrorCauseDebug = () => {
    errorUtil.runFunctionInDebugEnv(() => {
        const error = errorUtil.createCausedError();
        assertErrorStatusAndCombinedMessage(error, 500, error.cause.message);
    });
};

exports.testInternalErrorMessage = () => {
    const msg = "Internal error message";
    const error = HttpError.internalError(msg);
    assertErrorStatusAndMessage(error, 500);
};

exports.testInternalErrorMessageDebug = () => {
    errorUtil.runFunctionInDebugEnv(() => {
        const msg = "Internal error message";
        const error = HttpError.internalError(msg);
        assertErrorStatusAndCombinedMessage(error, 500, msg);
    });
};

exports.testInternalErrorCauseAndMessage = () => {
    const msg = "Internal error message";
    const error = errorUtil.createCausedError(msg);
    assertErrorStatusAndMessage(error, 500);
};

exports.testInternalErrorCauseAndMessageDebug = () => {
    errorUtil.runFunctionInDebugEnv(() => {
        const msg = "Internal error message";
        const error = errorUtil.createCausedError(msg);
        const expectedMsg = `${msg}: ${error.cause.message}`;
        assertErrorStatusAndCombinedMessage(error, 500, expectedMsg);
    });
};

exports.testNotFoundEmpty = () => {
    const error = HttpError.notFound();
    assertErrorStatusAndMessage(error, 404);
};

exports.testNotFoundString = () => {
    let resource = "/posts/5";
    const error = HttpError.notFound(resource);
    assertErrorStatusAndCombinedMessage(error, 404, resource);
};

exports.testMethodNotAllowedEmpty = () => {
    const error = HttpError.methodNotAllowed();
    assertErrorStatusAndMessage(error, 405);
};

exports.testMethodNotAllowedString = () => {
    let method = "POST";
    const error = HttpError.methodNotAllowed(method);
    assertErrorStatusAndCombinedMessage(error, 405, method);
};

exports.testBadRequestEmpty = () => {
    const error = HttpError.badRequest();
    assertErrorStatusAndMessage(error, 400);
};

exports.testBadRequestString = () => {
    let reason = "Missing parameter: name";
    const error = HttpError.badRequest(reason);
    assertErrorStatusAndCombinedMessage(error, 400, reason);
};

function defaultInternalErrorTest() {
    const error = HttpError.internalError();
    assertErrorStatusAndMessage(error, 500);
}

/**
 * @param {HttpError} error
 * @param {int} status
 */
function assertErrorStatusAndMessage(error, status) {
    assert.equal(error.status, status);
    assert.equal(error.message, http.STATUS_CODES[status]);
}

/**
 * @param {HttpError} error
 * @param {int} status
 * @param {string} message
 */
function assertErrorStatusAndCombinedMessage(error, status, message) {
    assert.equal(error.status, status);
    const expected = errorUtil.createCombinedMessage(status, message);
    assert.equal(error.message, expected);
}
