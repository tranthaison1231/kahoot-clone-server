import express from 'express';
import status from 'http-status';
import { Response } from '@shyn123/express-rest';
import Validator, { ValidationError } from 'fastest-validator';

const v = new Validator();
const questionSchema = {
  $$strict: true,
  content: 'string',
  image: 'string',
  timeLimit: 'number',
  points: 'number',
  isSingleSelect: 'boolean',
  answers: {
    type: 'object',
    props: {
      A: 'string',
      B: 'string',
      C: 'string',
      D: 'string'
    }
  },
  correctAnswer: 'string'
};

const validate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const isValid: true | ValidationError[] = v.validate(
      { ...req.body },
      questionSchema
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
export default validate;
