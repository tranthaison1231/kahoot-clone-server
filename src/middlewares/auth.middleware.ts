import express from 'express';
import status from 'http-status';
import * as jwt from 'jsonwebtoken';
import Response from '@/helpers/response.helper';

interface customRequest extends express.Request {
  tokenPayload: object;
}

const requireAuth = async (
  req: customRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.headers['x-access-token']) {
    return Response(res, { message: 'Missing token' }, status.UNAUTHORIZED);
  }
  const token = req.headers['x-access-token'].toString();
  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (payload.exp < Date.now()) {
      return Response(res, { message: 'Token expired' }, status.UNAUTHORIZED);
    }
    req.tokenPayload = payload;
    next();
  } catch (e) {
    return Response(res, { message: 'Invalid token' }, status.UNAUTHORIZED);
  }
};
export default requireAuth;
