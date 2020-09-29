import validate from '@/middlewares/validate.middleware';
import express from 'express';
import { ValidationSchema } from 'fastest-validator';


export const loginValidate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const schema: ValidationSchema = {
    $$strict: true, // no additional properties allowed
    username: 'string',
    password: 'string'
  };
  validate({ req, res, next, schema });
};
export const registerValidate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const schema: ValidationSchema = {
    $$strict: true,
    username: 'string',
    password: 'string',
    confirmPassword: 'string'
  };
  validate({ req, res, next, schema });
};
