export class ApiResponse {
    success;
    message;
    data;
    error;
    static ok(data, message = 'Success') {
        return { success: true, message, data };
    }
    static fail(message, error) {
        return { success: false, message, error };
    }
}
//# sourceMappingURL=api-response.dto.js.map