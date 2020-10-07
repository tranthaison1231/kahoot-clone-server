import Joi, { Schema } from 'joi';

export const schema: Schema = Joi.object({
  content: Joi.string().allow(''),
  image: Joi.string().allow(null),
  timeLimit: Joi.number().allow(''),
  points: Joi.number().allow(''),
  answers: Joi.object()
    .keys({
      A: Joi.alternatives().try(Joi.number(), Joi.string()).allow(''),
      B: Joi.alternatives().try(Joi.number(), Joi.string()).allow(''),
      C: Joi.alternatives().try(Joi.number(), Joi.string()).allow(''),
      D: Joi.alternatives().try(Joi.number(), Joi.string()).allow('')
    })
    .allow(''),
  correctAnswer: Joi.string().allow('')
});
