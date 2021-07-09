const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

/**
 * trims error return object
 * @param {object} errors error validation object
 * @returns 
 */
function removeContext(errors) {
  if (!errors) return undefined;

  let paramTypes = {
    body: 1,
    query: 1,
    header: 1,
    cookies: 1,
    params: 1
  };

  Object.keys(errors).forEach(key => {
    if (paramTypes) {
      errors[key].forEach((error) => {
        if (error.context) delete error.context;
      }) ;
    }
  });

  return errors;
}

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: err.message || 'Validation Error',
      errors: err.errors || removeContext(err.details),
      error: err.error,
      status: err.status || err.statusCode || (err.response && err.response.status),
      stack: err.stack
    });
  } else if (!(err instanceof APIError)) {
    if (err.response) {
      let { response: { data, status: _status } } = err;
      if (data) {
        convertedError = new APIError({
          message: data.error ? data.error.message : data.statusText,
          status: _status,
        });
      }
    } else {
      convertedError = new APIError({
        message: err.message,
        status: err.status,
        stack: err.stack,
      });
    }
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
