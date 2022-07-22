const path = require("path");
const { Logger } = require("./src/service/logger.js");
const { ServiceContainer } = require("./src/service/container.js");
const { runServer } = require("./src/server.js");
const { ErrorPageGenerator } = require("./src/service/error-page-generator.js");
const { HTML_ERROR_TEMPLATE } = require("./tests/utility/http-error.js");
const { loadPublicAssets } = require("./src/http/public-assets.js");

async function main() {
    const port = process.env.PORT || 3000;

    const logger = new Logger(process.stdout);

    const generator = new ErrorPageGenerator(HTML_ERROR_TEMPLATE);

    const publicAssetDir = path.resolve(__dirname, "public");
    const publicAssets = await loadPublicAssets(publicAssetDir);

    const container = new ServiceContainer(logger, generator, publicAssets);

    const callback = () => logger.log(`Server listening on port ${port}`);

    runServer(port, container, callback);
}

main();
