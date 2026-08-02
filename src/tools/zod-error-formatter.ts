import * as z from "zod";

function formatValidationError(error: z.ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(error);
    const errors = {
        ...fieldErrors,
        ...(formErrors.length > 0 && { _body: formErrors })
    };

    return {
        message: "Os dados informados são inválidos.",
        errors
    };
}

export { formatValidationError };
