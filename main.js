const { Logger } = require("./src/service/logger.js");
const { ServiceContainer } = require("./src/service/container.js");
const { runServer } = require("./src/server.js");
const { ErrorPageGenerator } = require("./src/service/error-page-generator.js");
const { HTML_ERROR_TEMPLATE } = require("./tests/utility/http-error.js");

const port = process.env.PORT || 3000;

const logger = new Logger(process.stdout);

const generator = new ErrorPageGenerator(HTML_ERROR_TEMPLATE);

const container = new ServiceContainer(logger, generator);

const callback = () => logger.log(`Server listening on port ${port}`);

runServer(port, container, callback);
