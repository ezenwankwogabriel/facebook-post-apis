const { Joi } = require('express-validation');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  // POST /v1/auth/register
  registerValidation: {
    body: Joi.object({
      name: Joi.string()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required()
    }),
  },

  // POST /v1/auth/login
  loginValidation: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required()
    }),
  },

  resetPasswordRequestValidation: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required()
    })
  },

  resetPasswordValidation: {
    body: Joi.object({
      userId: Joi.objectId()
        .required(),
      token: Joi.string()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required()
    })
  }
};

