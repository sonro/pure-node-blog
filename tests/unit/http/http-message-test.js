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
