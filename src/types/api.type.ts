export interface ApiResponse<T> {
    status: number;
    result: T,
}

export interface ApiError {
    isApiError: boolean;
    status: number;
    message: string;
}