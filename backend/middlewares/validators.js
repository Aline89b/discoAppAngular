const Joi = require("joi");
const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const signUpSchema = Joi.object({
  name: Joi.string().optional(),
  role: Joi.string().required(),
  email: Joi.string().min(6).required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*[A-Z])(?=.*\d).*$/)).required(),
});

const companySchema = Joi.object({
  name: Joi.string(),
  regione_sociale: Joi.string(),
  email: Joi.string().min(6),
  password: Joi.string().pattern(new RegExp('/^(?=.*[A-Z])(?=.*\d).*$/')),
  PI: Joi.string().pattern(new RegExp('^IT\\d{11}$')).required(),
  SDI:Joi.string().pattern(new RegExp('^[A-Za-z0-9]{7}$')).required(),
  address:Joi.string().required(),
  city:Joi.string().required(),
  zipCode:Joi.string().required(),
  phone:Joi.string().regex(/^\+39\d{9,10}$/).required(),
  userId:Joi.string()

});

const eventSchema = Joi.object({
  name: Joi.string().required(),
  locale: Joi.string().required(),
  time: Joi.string().required(),
  date: Joi.string().required(),
  price: Joi.number().optional(),
  createdBy: objectIdSchema.required(),
  
});
const localeSchema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().optional(),
    phone:Joi.string().optional(),
    userId:Joi.string().required(),
    address:Joi.string().required(),
    city:Joi.string().required(),
    zipCode:Joi.string().required(),
    capacity:Joi.number().required(),

});
const guestSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  phone: Joi.string().regex(/^\+39\d{9,10}$/).required(),
  status: Joi.string().valid('invited', 'confirmed', 'declined', 'attended').default('invited'),
  qrcode:Joi.string().default(''),
  noOfFriends: Joi.number(),

});

const listSchema = Joi.object({
  name: Joi.string().required(),
  createdBy: objectIdSchema.required(),
  companyId:  objectIdSchema.required(),
  guests: Joi.array().items(guestSchema).optional(), 
  event:objectIdSchema.required(),
   
})




module.exports = {signUpSchema, companySchema, localeSchema, eventSchema,guestSchema,listSchema};
