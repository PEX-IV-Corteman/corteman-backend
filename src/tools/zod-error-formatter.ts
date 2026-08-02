import * as z from "zod";
import type { ApiErrorResponse } from "../interfaces/api-response.js";

function formatValidationError(error: z.ZodError): ApiErrorResponse {
    const groupedErrors = new Map<string | null, string[]>();

    for (const issue of error.issues) {
        const field = issue.path.length > 0 ? issue.path.map(String).join(".") : null;
        const messages = groupedErrors.get(field) ?? [];

        messages.push(issue.message);
        groupedErrors.set(field, messages);
    }

    return {
        success: false,
        message: "Os dados informados são inválidos.",
        data: null,
        errors: Array.from(groupedErrors, ([field, messages]) => ({
            field,
            messages
        }))
    };
}

export { formatValidationError };
