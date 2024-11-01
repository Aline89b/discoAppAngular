const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string(),
  role: Joi.string(),
  email: Joi.string().min(6).required(),
  password: Joi.string().required(),
});

module.exports = signUpSchema;
