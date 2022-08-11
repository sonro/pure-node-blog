const { randomUUID } = require("crypto");
const argon2 = require("argon2");

class UserService {
    /**
     * @type {string?}
     */
    sessionId = null;

    /**
     * @type {UserRepository}
     */
    repo;

    /**
     * @param {UserRepository} userRepository
     */
    constructor(userRepository) {
        this.repo = userRepository;
    }

    /**
     * @param {string} sessionId - Current session ID
     * @returns {boolean}
     */
    isCurrentSessionId(sessionId) {
        return sessionId === this.sessionId;
    }

    /**
     * @param {string} plainPassword
     * @returns {string?} sessionId
     */
    async login(plainPassword) {
        const stored = this.repo.password;
        const correctPass = await argon2.verify(stored, plainPassword);
        if (!correctPass) {
            return null;
        }

        return createSessionId(this);
    }

    logout() {
        this.sessionId = null;
    }

    /**
     * @param {string} plainPassword
     * @returns {string} sessionId
     */
    async setup(plainPassword) {
        const alreadySetup = this.repo.isSet();
        if (alreadySetup) {
            return null;
        }
        const hash = await argon2.hash(plainPassword);
        await this.repo.set(hash);
        return createSessionId(this);
    }
}

/**
 * @param {UserService} userService
 * @returns {string}
 */
function createSessionId(userService) {
    const sessionId = randomUUID({ disableEntropyCache: true });
    userService.sessionId = sessionId;
    return sessionId;
}

module.exports = { UserService };
