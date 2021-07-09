const httpStatus = require('http-status');
const forwarded = require('forwarded-host');
const UserModel = require('../models/user.model.js');
const { 
  registerUser, 
  loginUser, 
  requestResetPassword,
  resetPassword
 } = require('../service/auth.service');

/**
 * Registers a user
 * @public
 * @returns token object and user object
 */ 
exports.registerUser = async (req, res, next) => {
  try {
    const registerUserService = await registerUser(req.body);

    res.status(httpStatus.CREATED);
    return res.json(registerUserService);
  } catch (error) {
    return next(UserModel.checkDuplicateEmail(error));
  }
};

/**
 * Login a user
 * @public
 * @returns token and user object
 */
exports.loginUser = async (req, res, next) => {
  try {
    const loginUserService = await loginUser(req.body);

    return res.json(loginUserService);
  } catch (error) {
    return next(error);
  }
};

/**
 * 
 * @returns password reset link
 */
exports.requestResetPassword = async (req, res, next) => {
  try {
    const requestResetPasswordService = await requestResetPassword(req.body.email);

    return res.json(requestResetPasswordService);
  } catch (error) {
    return next(error);
  }
};

/**
 * 
 * @returns success on password reset
 */
 exports.resetPassword = async (req, res, next) => {
  try {
    const { userId, token, password } = req.body;
    await resetPassword(userId, token, password);

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return next(error);
  }
};
