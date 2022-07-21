const assert = require("assert");
const http = require("http");
const { HttpError } = require("../../../src/http/http-error");
const {
    ErrorPageGenerator,
} = require("../../../src/service/error-page-generator");

exports.testTitleReplacement = () => {
    const template = "START{{title}}END";
    const generator = new ErrorPageGenerator(template);
    const error = HttpError.internalError();

    const title = `${error.status} ${http.STATUS_CODES[error.status]}`;
    const expected = `START${title}END`;
    assert.equal(generator.generate(error), expected);
};

exports.testMessageReplacement = () => {
    const template = "START{{message}}END";
    const generator = new ErrorPageGenerator(template);
    const error = HttpError.internalError();

    const expected = `START${error.message}END`;
    assert.equal(generator.generate(error), expected);
};
