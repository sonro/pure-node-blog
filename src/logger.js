const { Stream } = require("stream");

class Logger {
    /**
     * @param  {...Stream} streams 
     */
    constructor(...streams) {
        this.streams = streams;
    }

    /**
     * @param {string} message 
     */
    async log(message) {
        for (const stream of this.streams) {
            await logToStream(message, stream);
        }
    }

    close() {
        for (const stream of this.streams) {
            if (stream.end) {
                stream.end();
            }
        }
    }
}

/**
 * @param {string} message
 * @param  {Stream} stream
 * @returns {Promise<void>}
 */
function logToStream(message, stream) {
    return new Promise((resolve, reject) => {
        stream.write(message + "\n", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }); 
}

exports.Logger = Logger;