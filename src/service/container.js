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
     * @type {Object}
     */
    publicAssets;

    /**
     * @param {Logger} logger
     * @param {ErrorPageGenerator} generator
     * @param {Object} publicAssets
     */
    constructor(logger, generator, publicAssets) {
        this.logger = logger;
        this.errorPageGenerator = generator;
        this.publicAssets = publicAssets;
    }
}

exports.ServiceContainer = ServiceContainer;