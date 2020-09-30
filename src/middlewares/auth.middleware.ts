import status from 'http-status';
import * as jwt from 'jsonwebtoken';
import { Response as HttpResponse } from '@shyn123/express-rest';
import { Request, Response, NextFunction } from 'express';
import UserModel from '@/modules/Auth/user.model';
import { UserTransform } from '@/modules/Auth/user.model';

export interface RequestWithUser extends Request {
  user: UserTransform;
}

const requireAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers['x-access-token']) {
    return HttpResponse(res, { message: 'Missing token' }, status.UNAUTHORIZED);
  }
  const token = req.headers['x-access-token'].toString();
  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (payload.exp < Date.now()) {
      return HttpResponse(
        res,
        { message: 'Token expired' },
        status.UNAUTHORIZED
      );
    }
    const user = await UserModel.findById(payload.userId);
    req.user = user.transform();
    next();
  } catch (e) {
    return HttpResponse(res, { message: 'Invalid token' }, status.UNAUTHORIZED);
  }
};
export default requireAuth;
