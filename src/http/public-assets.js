const fs = require("fs/promises");
const path = require("path");

/**
 * @param {string} dirPath
 */
async function loadPublicAssets(dirPath) {
    const assets = {};
    for await (const file of yieldFiles(dirPath)) {
        const urlPath = file.substring(dirPath.length).toLowerCase();
        const contents = await fs.readFile(file);
        assets[urlPath] = contents;
    }

    return assets;
}

/**
 * @param {string} dirPath
 * @returns {string}
 */
async function* yieldFiles(dirPath) {
    const dirList = await fs.readdir(dirPath, { withFileTypes: true });
    for (const dirEnt of dirList) {
        const fullPath = path.join(dirPath, dirEnt.name);
        if (dirEnt.isDirectory()) {
            yield* yieldFiles(fullPath);
        } else {
            yield fullPath;
        }
    }
}

module.exports = {
    loadPublicAssets,
};
