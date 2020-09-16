import * as jwt from "jsonwebtoken";
import express, { NextFunction } from "express";
import Response from "@/helpers/response.helper";

interface customRequest extends express.Request {
  tokenPayload: object;
}

const requireAuth = async (
  req: customRequest,
  res: express.Response,
  next: NextFunction
) => {
  if (!req.headers["x-access-token"]) {
    return Response.error(res, { message: "Missing token" }, 401);
  }
  const token = req.headers["x-access-token"].toString();
  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (payload.exp < Date.now()) {
      return Response.error(res, { message: "Token expired" }, 401);
    }
    req.tokenPayload = payload;
    next();
  } catch (e) {
    return Response.error(res, { message: "Invalid token" }, 401);
  }
};
export default requireAuth;
