const os = require("os");
const fs = require("fs/promises");
const path = require("path");
const assert = require("assert");
const { UserRepository } = require("../../../src/domain/user-repository");
const { constants: fsConst, write, readFileSync } = require("fs");

exports.testNewRepoNoFile = async () => {
    const dataPath = await createTmpFilePath();

    const repo = new UserRepository(dataPath);
    await fs.access(dataPath, fsConst.R_OK | fsConst.W_OK);

    const json = await fs.readFile(dataPath, "utf-8");
    assert.equal(json, DEFAULT_JSON);
    assert.equal(repo.isSet(), false);
};

exports.testGetPassword = async () => {
    const repo = await createInitRepo();
    const _pass = repo.password;
}

exports.testGetDataPath = async () => {
    const repo = await createInitRepo();
    const _dataPath = repo.dataPath;
}

exports.testSetPasswordDirectFail = async () => {
    const repo = await createInitRepo();
    const initPass = repo.password;
    repo.password = "test";
    assert.equal(repo.password, initPass);
}

exports.testSetDataPathDirectFail = async () => {
    const repo = await createInitRepo();
    const initDataPath = repo.dataPath;
    repo.dataPath = "test";
    assert.equal(repo.dataPath, initDataPath);
}

exports.testNewRepoExistingFile = async () => {
    const data = createDirtyData();
    const dataPath = await createTmpFileWithData(data);

    const repo = new UserRepository(dataPath);
    assert.equal(repo.password, data.password);
    assert.equal(repo.isSet(), data.set);
};

exports.testInitRepoSet = async () => {
    const repo = await createInitRepo();
    const pass = "abc";

    const promise = repo.set(pass);
    assert.equal(repo.password, pass);
    assert(repo.isSet());

    promise.then(() => {
        const storedPass = getPasswordFromRepoFile(repo);
        assert.equal(storedPass, pass);
    });
};

exports.testInitRepoDoubleSet = async () => {
    const repo = await createInitRepo();
    const pass1 = "abc";
    const pass2 = "123";

    repo.set(pass1);
    const prom2 = repo.set(pass2);
    assert.equal(repo.password, pass2);
    assert(repo.isSet());

    prom2.then(() => {
        const storedPass = getPasswordFromRepoFile(repo);
        assert.equal(storedPass, pass2);
    });
};

/**
 * @returns {object}
 */
function createDirtyData() {
    return {
        set: true,
        password: "abcdefg",
    };
}

const DEFAULT_JSON = JSON.stringify({
    set: false,
    password: "",
});

/**
 * @returns {string} filePath
 */
async function createTmpFileWithData(data) {
    const dataPath = await createTmpFilePath();
    const json = JSON.stringify(data);
    await fs.writeFile(dataPath, json, { mode: 0o600 });
    return dataPath;
}

/**
 * @returns {UserRepository}
 */
async function createInitRepo() {
    const dataPath = await createTmpFilePath();
    return new UserRepository(dataPath);
}

/**
 * @param {UserRepository} repo
 * @returns {string}
 */
function getPasswordFromRepoFile(repo) {
    const json = readFileSync(repo.dataPath, "utf-8");
    const data = JSON.parse(json);
    return data.password;
}

/**
 * @returns {string} temp data file path
 */
async function createTmpFilePath() {
    const prefix = path.join(os.tmpdir(), "pnb-data-");
    const tmpdir = await fs.mkdtemp(prefix);
    return path.join(tmpdir, "data.json");
}
