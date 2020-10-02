import Joi, { Schema } from 'joi';

export const schema: Schema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string().required(),
  timeLimit: Joi.number().required(),
  points: Joi.number().required(),
  isSingleSelect: Joi.boolean().required(),
  answers: Joi.object()
    .keys({
      A: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
      B: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
      C: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
      D: Joi.alternatives().try(Joi.number(), Joi.string()).required()
    })
    .required(),
  correctAnswer: Joi.string().required()
});
