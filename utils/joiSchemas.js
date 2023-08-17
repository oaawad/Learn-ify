const Joi = require('joi');
const joiSchemas = {
  userRegister: Joi.object().keys({
    terms: Joi.bool().default(true).required().messages({
      'any.required': 'You must agree to the terms and conditions',
      'boolean.base': 'You must agree to the terms and conditions',
    }),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
  userLogin: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
  adminCreate: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  downloadNotes: Joi.object().keys({
    notes: Joi.string().required(),
    id: Joi.string().hex().length(24),
  }),
};
module.exports = joiSchemas;
