const Joi = require("joi");

const signUpSchema = Joi.object({
  role: Joi.string(),
  mail: Joi.string().min(6).required(),
  pw: Joi.string().required(),
});

module.exports = signUpSchema;
