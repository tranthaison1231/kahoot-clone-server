"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
}
Response.success = (res, data, status = 200) => {
    return res.status(status).json(Object.assign({ success: true }, data));
};
Response.error = (res, err, status = 400) => {
    return res.status(status).json({
        success: false,
        error: {
            message: err.message,
            type: err.type,
            errors: err.errors
        }
    });
};
exports.default = Response;
//# sourceMappingURL=response.helper.js.map