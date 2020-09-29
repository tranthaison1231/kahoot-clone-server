import validate from '@/middlewares/validate.middleware';
import express, { NextFunction } from 'express';
import { ValidationSchema } from 'fastest-validator';

const kahootValidate = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const schema: ValidationSchema = {
    $$strict: true,
    title: 'string'
  };
  validate({ req, res, next, schema });
};

export default kahootValidate;
