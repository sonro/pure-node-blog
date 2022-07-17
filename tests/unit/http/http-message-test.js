const assert = require("assert");
const http = require("http");
const { HttpMessage } = require("../../../src/http/http-message");

exports.testWantsJsonTrue = () => {
    const req = new http.IncomingMessage();
    req.headers.accept = "application/json";
    const message = new HttpMessage(req, null);
    assert(message.wantsJson());
};

exports.testWantsJsonFalse = () => {
    const req = new http.IncomingMessage();
    const message = new HttpMessage(req, null);
    assert.equal(message.wantsJson(), false);
};

exports.testIsJsonTrue = () => {
    const req = new http.IncomingMessage();
    req.headers["content-type"] = "application/json";
    const message = new HttpMessage(req, null);
    assert(message.isJson());
};

exports.testIsJsonFalse = () => {
    const req = new http.IncomingMessage();
    const message = new HttpMessage(req, null);
    assert.equal(message.isJson(), false);
};

exports.testJson = () => {
    const req = new http.IncomingMessage();
    const res = new http.ServerResponse(req);
    const message = new HttpMessage(req, res);

    const body = { message: "test" };
    message.json(body);
    res.end();

    const actual = res.getHeader("content-type");
    assert.equal(actual, "application/json");

    const expected = JSON.stringify(body);
    const output  = res.outputData[0].data;
    assert(output.includes(expected));
};
