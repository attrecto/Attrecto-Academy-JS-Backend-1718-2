'use strict';

class AppError extends Error {
    constructor(status, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }

        // Custom debugging information
        this.status = status;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            stack: this.stack
        }
    }
}

module.exports = AppError;