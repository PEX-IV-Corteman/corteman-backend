import type { ErrorCodes } from "./error-codes.js";

export class DatabaseError extends Error {
    
    public errorCode: ErrorCodes;
    
    constructor(message: string, errorCode: ErrorCodes) {
        super(message);
        this.errorCode = errorCode;
    }
    
}
