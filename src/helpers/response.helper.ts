import * as express from "express";
class Response {
  static success = (res: express.Response, data: any, status = 200) => {
    return res.status(status).json({
      success: true,
      ...data
    });
  };
  static error = (res: express.Response, err: any, status = 400) => {
    return res.status(status).json({
      success: false,
      error: {
        message: err.message,
        type: err.type,
        errors: err.errors
      }
    });
  };
}
export default Response;
