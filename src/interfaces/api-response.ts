interface ApiError {
    field: string | null;
    messages: string[];
}

interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    errors: [];
}

interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
    errors: ApiError[];
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type { ApiError, ApiErrorResponse, ApiResponse, ApiSuccessResponse };
