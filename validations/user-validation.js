const Joi = require("joi");

const userLoginValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

const userLogoutValidation = Joi.object({
  token: Joi.string().max(255).required(),
});

module.exports = { userLoginValidation, userLogoutValidation };
