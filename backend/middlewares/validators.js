const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string(),
  role: Joi.string(),
  email: Joi.string().min(6).required(),
  password: Joi.string().required(),
});

const companySchema = Joi.object({
  name: Joi.string(),
  regione_sociale: Joi.string(),
  email: Joi.string().min(6),
  password: Joi.string(),
  PI: Joi.string(),
  SDI:Joi.string(),
  address:Joi.string(),
  city:Joi.string(),
  zipCode:Joi.string(),
  phone:Joi.string(),
  userId:Joi.string()

});



module.exports = {signUpSchema, companySchema};
