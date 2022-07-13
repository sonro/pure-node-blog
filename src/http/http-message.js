/**
 * HTTP request and response objects
 */
class HttpMessage {
    /**
     * @type {http.IncomingMessage}
     */
    request;

    /**
     * @type {http.ServerResponse}
     */
    response;

    /**
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
}

exports.HttpMessage = HttpMessage;