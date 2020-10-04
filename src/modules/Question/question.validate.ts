import Joi, { Schema } from 'joi';

export const schema: Schema = Joi.object({
  content: Joi.string(),
  image: Joi.string(),
  timeLimit: Joi.number(),
  points: Joi.number(),
  isSingleSelect: Joi.boolean(),
  answers: Joi.object()
    .keys({
      A: Joi.alternatives().try(Joi.number(), Joi.string()),
      B: Joi.alternatives().try(Joi.number(), Joi.string()),
      C: Joi.alternatives().try(Joi.number(), Joi.string()),
      D: Joi.alternatives().try(Joi.number(), Joi.string())
    })
    .required(),
  correctAnswer: Joi.string()
});
