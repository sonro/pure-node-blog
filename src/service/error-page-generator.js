const http = require("http");
const { HttpError } = require("../http/http-error");

/**
 * Generate an error page from a template
 *
 * Template injection format must be {{variable}} without whitespace
 * Required variables: title, message
 */
class ErrorPageGenerator {
    /**
     * @param {string} template
     */
    constructor(template) {
        this.template = template;
    }

    /**
     * @param {HttpError} httpError
     * @returns {string}
     */
    generate(httpError) {
        const title = createTitle(httpError);
        let output = this.template.replace("{{title}}", title);
        return output.replace("{{message}}", httpError.message);
    }
}

/**
 * @param {HttpError} httpError
 * @returns {string}
 */
function createTitle(httpError) {
    return `${httpError.status} ${http.STATUS_CODES[httpError.status]}`;
}

exports.ErrorPageGenerator = ErrorPageGenerator;
