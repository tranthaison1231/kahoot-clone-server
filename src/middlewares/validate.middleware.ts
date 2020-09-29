import express from 'express';
import status from 'http-status';
import { Response } from '@shyn123/express-rest';
import Validator, {
  ValidationError,
  ValidationSchema
} from 'fastest-validator';

const v = new Validator();

interface ValidateInput {
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
  schema: ValidationSchema;
}

const validate = async (input: ValidateInput) => {
  const { req, res, next, schema } = input;
  try {
    const isValid: true | ValidationError[] = v.validate(
      { ...req.body },
      schema
    );
    if (isValid === true) {
      return next();
    }
    return Response(res, { message: isValid[0].message }, status.BAD_REQUEST);
  } catch (error) {
    return Response(
      res,
      { error: error.message },
      status.INTERNAL_SERVER_ERROR
    );
  }
};
export default validate;
