const { Logger } = require("./src/logger.js");
const { runServer } = require("./src/server.js");

const port = process.env.PORT || 3000;
const logger = new Logger(process.stdout);
const callback = () => logger.log(`Server listening on port ${port}`);
runServer(port, logger, callback);
