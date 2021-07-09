const _ = require('lodash');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');

const UserModel = require('../models/user.model');
const TokenModel = require('../models/token.model');

const Email = require('../utils/email');
const APIError = require('../utils/APIError');
const { bcryptSalt } = require('../../config/vars');


exports.registerUser = async (body) => {
  const data = _.pick(body, ['email', 'password', 'name']);
  const users = await UserModel.find()
  const user = await UserModel.create(data);
  const token = user.encryptPayload();

  // send email;
  const emailDetials = {
    ...data,
    subject: 'Welcome Email',
    template: 'welcome-mail',
  };

  await Email(emailDetials).send();

  return { token };
};

exports.loginUser = async (body) => {
  const data = _.pick(body, ['email', 'password']);
  const user = await UserModel.authenticateUser(data);
  const token = user.encryptPayload();

  return { token };
};

exports.requestResetPassword = async (email, host) => {
  const user = await UserModel.findByEmail({email, exist: true});

  const token = await TokenModel.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new TokenModel({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  return {
    token: resetToken,
    userId: user._id,
  };
};

exports.resetPassword = async (userId, token, password) => {
  const passwordResetToken = await TokenModel.findOne({ userId });
  if (!passwordResetToken) {
    throw new APIError({
      message: 'Password reset not yet requested',
      status: httpStatus.BAD_REQUEST,
      isPublic: true,
    });
  }
  
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new APIError({
      message: 'Invalid password reset token',
      status: httpStatus.BAD_REQUEST,
      isPublic: true,
    });
  }

  await UserModel.updateOne(
    { _id: userId },
    { $set: { password } }
  );

  const user = await UserModel.findById({ _id: userId });
  const emailDetails = {
    email: user.email,
    subject: 'Reset Password',
    template: 'reset-password',
    name: user.name
  };

  await Email(emailDetails).send();
  await passwordResetToken.deleteOne();

  return true;
};
