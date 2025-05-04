// StandardError.ts
'use strict';

export class StandardError extends Error {
    constructor(
        public message: string,
        public statusCode = 500,
        public details?: any
      ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
      }
}
