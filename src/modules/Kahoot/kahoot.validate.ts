import Joi, { Schema } from 'joi';

export const createSchema: Schema = Joi.object({
  title: Joi.string().required()
});
export const updateSchema: Schema = Joi.object({
  title: Joi.string().required(),
  questions: Joi.array().required()
});
