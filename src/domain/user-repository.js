const { readFileSync, writeFileSync } = require("fs");
const { writeFile } = require("fs/promises");

/**
 * Handle loading and storing of UserData in a JSON file
 */
class UserRepository {
    /**
     * @type {string}
     */
    #dataPath;

    /**
     * @type {object}
     */
    #data;

    /**
     * @type {Promise}
     */
    #filePromise = Promise.resolve();

    /**
     * @param {string} dataPath
     */
    constructor(dataPath) {
        this.#dataPath = dataPath;
        this.#data = readOrCreateDataFile(dataPath);
    }

    /**
     * @returns {string}
     */
    get password() {
        return this.#data.password;
    }

    /**
     * @returns {string}
     */
    get dataPath() {
        return this.#dataPath;
    }

    /**
     * @returns {boolean}
     */
    isSet() {
        return this.#data.set;
    }

    /**
     * @param {string} password
     * @returns {Promise<void>} Saving data to file
     */
    async set(password) {
        this.#data = {
            set: true,
            password: password,
        };

        // wait for previous filePromise to finish
        await this.#filePromise;

        // write file
        const json = JSON.stringify(this.#data);
        this.#filePromise = writeFile(this.#dataPath, json);

        return this.#filePromise;
    }
}

/**
 * @param {string} dataPath
 * @returns {object} data
 */
function readOrCreateDataFile(dataPath) {
    try {
        return JSON.parse(readFileSync(dataPath));
    } catch (err) {
        if (err instanceof SyntaxError) {
            throw new Error(`Invalid JSON in User data file: ${dataPath}`, {
                cause: err,
            });
        }
        const fileNotFound = err.code && err.code === "ENOENT";
        if (fileNotFound) {
            createDataFile(dataPath);
            return DEFAULT_DATA;
        } else {
            throw new Error(`File system error accessing ${dataPath}`, {
                cause: err,
            });
        }
    }
}

const DEFAULT_DATA = {
    set: false,
    password: "",
};

/**
 * @param {string} dataPath
 */
function createDataFile(dataPath) {
    const data = JSON.stringify(DEFAULT_DATA);
    writeFileSync(dataPath, data, { mode: 0o600 });
}

exports.UserRepository = UserRepository;
