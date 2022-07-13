const { Logger } = require("./src/service/logger.js");
const { ServiceContainer } = require("./src/service/container.js");
const { runServer } = require("./src/server.js");

const port = process.env.PORT || 3000;
const logger = new Logger(process.stdout);
const container = new ServiceContainer(logger);
const callback = () => logger.log(`Server listening on port ${port}`);
runServer(port, container, callback);
