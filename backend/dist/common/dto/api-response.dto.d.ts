export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    static ok<T>(data: T, message?: string): ApiResponse<T>;
    static fail(message: string, error?: string): ApiResponse<any>;
}
