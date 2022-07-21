const { ErrorPageGenerator } = require("./error-page-generator");
const { Logger } = require("./logger");

/**
 * Application services for use in server controllers.
 */
class ServiceContainer {
    /**
     * @type {Logger}
     */
    logger;

    /**
     * @type {ErrorPageGenerator}
     */
    errorPageGenerator;

    /**
     * @param {Logger} logger
     * @param {ErrorPageGenerator} generator
     */
    constructor(logger, generator) {
        this.logger = logger;
        this.errorPageGenerator = generator;
    }
}

exports.ServiceContainer = ServiceContainer;