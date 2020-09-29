import validate from '@/middlewares/validate.middleware';
import express from 'express';

const questionValidate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const schema = {
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
  validate({ req, res, next, schema });
};
export default questionValidate;
