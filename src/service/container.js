/**
 * Application services for use in server controllers.
 */
class ServiceContainer {
    /**
     * @type {Logger}
     */
    logger;

    /**
     * @param {Logger} logger
     */
    constructor(logger) {
        this.logger = logger;
    }
}

exports.ServiceContainer = ServiceContainer;