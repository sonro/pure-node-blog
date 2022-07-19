const assert = require("assert");
const http = require("http");
const { HttpMessage } = require("../../../src/http/http-message");
const { createTestMessage, createTestMessageJson } = require("../../utility");

exports.testWantsJsonTrue = () => {
    const message = createTestMessage();
    message.request.headers.accept = "application/json";
    assert(message.wantsJson());
};

exports.testWantsJsonFalse = () => {
    const message = createTestMessage();
    assert.equal(message.wantsJson(), false);
};

exports.testIsJsonTrue = () => {
    const message = createTestMessage();
    message.request.headers["content-type"] = "application/json";
    assert(message.isJson());
};

exports.testIsJsonFalse = () => {
    const message = createTestMessage();
    assert.equal(message.isJson(), false);
};

exports.testJson = () => {
    const message = createTestMessage();
    const res = message.response;

    const body = { message: "test" };
    message.json(body);
    res.end();

    const actual = res.getHeader("content-type");
    assert.equal(actual, "application/json");

    const expected = JSON.stringify(body);
    const output = res.outputData[0].data;
    assert(output.includes(expected));
};

exports.testPostJsonData = () => {
    const data = { name: "Test Name" };
    const message = createTestMessageJson(data);
    assert.equal(message.requestBody, JSON.stringify(data));
    assert.equal(message.requestData.name, data.name);
};

exports.testNoRequestBody = () => {
    const message = createTestMessage();
    assert.equal(message.requestBody, "");
};
