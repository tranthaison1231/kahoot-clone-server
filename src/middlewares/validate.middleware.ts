import { Schema } from 'joi';
import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Response as HttpResponse } from '@shyn123/express-rest';

const validate = (schema: Schema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = schema.validate({ ...req.body });
    if (value.error) {
      const error = value.error.details.map((err) => {
        return err.message.replace(/[""]/g, '');
      });
      return HttpResponse(res, { error }, status.BAD_REQUEST);
    }
    next();
  } catch (error) {
    return HttpResponse(res, { error }, status.INTERNAL_SERVER_ERROR);
  }
};

export default validate;
