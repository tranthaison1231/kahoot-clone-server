import Joi, { Schema } from 'joi';

export const loginSchema: Schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
export const registerSchema: Schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
});
