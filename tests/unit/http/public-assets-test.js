const os = require("os");
const fs = require("fs/promises");
const path = require("path");
const assert = require("assert");
const { loadPublicAssets } = require("../../../src/http/public-assets");

exports.testEmptyDir = async () => {
    const dirPath = await createTmpDir();
    const assets = await loadPublicAssets(dirPath);
    assert.equal(Object.keys(assets).length, 0);
};

exports.testOneHtmlFile = async () => {
    const dirPath = await createTmpDir();
    const urlPath = await addFileToDir(dirPath, INDEX_PATH, TEST_HTML);
    const assets = await loadPublicAssets(dirPath);
    assert.equal(Object.keys(assets).length, 1);
    assert.equal(assets[urlPath], TEST_HTML);
};

exports.testTwoHtmlFiles = async () => {
    const dirPath = await createTmpDir();
    const urlPath1 = await addFileToDir(dirPath, "one.html", TEST_HTML);
    const urlPath2 = await addFileToDir(dirPath, "two.html", TEST_HTML);
    const assets = await loadPublicAssets(dirPath);
    assert.equal(Object.keys(assets).length, 2);
    assert.equal(assets[urlPath1], TEST_HTML);
    assert.equal(assets[urlPath2], TEST_HTML);
};

exports.testInnerDirEmpty = async () => {
    const outerDir = await createTmpDir();
    await addDirToDir(outerDir, "inner");
    const assets = await loadPublicAssets(outerDir);
    assert.equal(Object.keys(assets).length, 0);
};

exports.testInnerDirOneFile = async () => {
    const outerDir = await createTmpDir();
    const innerDirName = "innerDir";
    const innerDirPath = await addDirToDir(outerDir, innerDirName);
    const fileUrl = await addFileToDir(innerDirPath, INDEX_PATH, TEST_HTML);
    const urlPath = `/${innerDirName}${fileUrl}`.toLowerCase();

    const assets = await loadPublicAssets(outerDir);
    assert.equal(Object.keys(assets).length, 1);
    assert.equal(assets[urlPath], TEST_HTML);
};

exports.testMixedDirFiles = async () => {
    const outerDir = await createTmpDir();
    const innerDirName = "innerDir";
    const innerDirPath = await addDirToDir(outerDir, innerDirName);
    const innerFileUrl = await addFileToDir(
        innerDirPath,
        INDEX_PATH,
        TEST_HTML
    );
    const innerUrlPath = `/${innerDirName}${innerFileUrl}`.toLowerCase();
    const outerUrlPath = await addFileToDir(outerDir, INDEX_PATH, TEST_HTML);

    const assets = await loadPublicAssets(outerDir);
    assert.equal(Object.keys(assets).length, 2);
    assert.equal(assets[innerUrlPath], TEST_HTML);
    assert.equal(assets[outerUrlPath], TEST_HTML);
};

/**
 * @returns {string} dirPath
 */
async function createTmpDir() {
    const prefix = path.join(os.tmpdir(), "pnb-public-");
    return await fs.mkdtemp(prefix);
}

/**
 * @param {string} dirPath
 * @param {string} fileName
 * @param {string} contents
 * @returns {string} urlPath
 */
async function addFileToDir(dirPath, fileName, contents) {
    const filePath = path.join(dirPath, fileName);
    await fs.writeFile(filePath, contents);
    return "/" + fileName;
}

/**
 * @param {string} outerDirPath
 * @param {string} innerDirName
 * @returns {string} innerDirPath
 */
async function addDirToDir(outerDirPath, innerDirName) {
    const dirPath = path.join(outerDirPath, innerDirName);
    await fs.mkdir(dirPath);
    return dirPath;
}

const TEST_HTML = "<body><h1>TestHtml</h1></body>";
const INDEX_PATH = "index.html";
