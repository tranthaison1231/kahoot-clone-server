import { Schema } from 'joi';
import status from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { Response as HttpResponse } from '@shyn123/express-rest';

const validate = (schema: Schema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = schema.validate({ ...req.body }, { abortEarly: false });
    console.log(value);
    if (value.error) {
      const error = value.error.details.reduce((result: any, err) => {
        const key = err.path[0];
        result[key] = err.message.replace(/[""]/g, '');
        return result;
      }, {});
      return HttpResponse(res, { error }, status.BAD_REQUEST);
    }
    next();
  } catch (err) {
    console.log('err', err);
  }
};

export default validate;
