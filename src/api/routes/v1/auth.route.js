const express = require('express');
const { validate } = require('express-validation');
const authController = require('../../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation, 
  resetPasswordRequestValidation,
  resetPasswordValidation
} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @api {post} v1/auth/register Register User
 */
router.route('/register')
  .post(validate(registerValidation), authController.registerUser);

/**
 * @api {post} v1/auth/login Login User
 */
router.route('/login')
  .post(validate(loginValidation), authController.loginUser);

/**
 * @api {post} v1/auth/request-password-reset Request User Password Reset
 */
 router.route('/request-password-reset')
  .post(validate(resetPasswordRequestValidation), authController.requestResetPassword);

/**
 * @api {post} v1/auth/reset-password Reset User Password
 */
 router.route('/reset-password')
  .post(validate(resetPasswordValidation), authController.resetPassword);

module.exports = router;