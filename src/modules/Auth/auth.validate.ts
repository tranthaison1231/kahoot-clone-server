import express from 'express';
import status from 'http-status';
import { Response } from '@shyn123/express-rest';
import Validator, { ValidationError } from 'fastest-validator';

const v = new Validator();
const loginSchema = {
  $$strict: true, // no additional properties allowed
  username: 'string',
  password: 'string'
};
const registerSchema = {
  $$strict: true,
  username: 'string',
  password: 'string',
  confirmPassword: 'string'
};

export const loginValidate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const isValid: true | ValidationError[] = v.validate(
      { ...req.body },
      loginSchema
    );
    if (isValid === true) {
      return next();
    }
    return Response(res, { message: isValid[0].message }, status.UNAUTHORIZED);
  } catch (error) {
    return Response(
      res,
      { error: error.message },
      status.INTERNAL_SERVER_ERROR
    );
  }
};
export const registerValidate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const isValid: true | ValidationError[] = v.validate(
      { ...req.body },
      registerSchema
    );
    if (isValid === true) {
      return next();
    }
    return Response(res, { message: isValid[0].message }, status.UNAUTHORIZED);
  } catch (error) {
    return Response(
      res,
      { error: error.message },
      status.INTERNAL_SERVER_ERROR
    );
  }
};
