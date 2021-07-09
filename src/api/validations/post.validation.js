const { Joi } = require('express-validation');

module.exports = {
  // POST /v1/post
  publishValidation: {
    body: Joi.object({
      message: Joi.string()
        .required()
    }),
  },

  // DELETE /v1/post/
  deleteValidation: {
    params: Joi.object({
      pagePostId: Joi.string()
        .required()
    })
  },

  // PUT /v1/post/
  updateValidation: {
    body: Joi.object({
      message: Joi.string()
        .required()
    }),
    params: Joi.object({
      pagePostId: Joi.string()
        .required()
    })
  },

  // POST /v1/post/comment
  commentValidation: {
    body: Joi.object({
      message: Joi.string()
        .required()
    }),
    params: Joi.object({
      pagePostId: Joi.string()
        .required()
    })
  },

  uploadValidation: {
    body: Joi.object({
      pathToUrl: Joi.string()
        .required()
    }),
    params: Joi.object({
      pageId: Joi.string()
        .required()
    })
  },
};

