const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment-timezone');
const encryptPassword = require('../utils/encryptPassword');
const APIError = require('../utils/APIError');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: { type: String, set: encryptPassword, required: true, select: false }
  }
);

userSchema.methods.encryptPayload = function() {
  const payload = {
    id: this._id,
    email: this.email,
    exp: moment().add(jwtExpirationInterval, 'minutes').unix()
  };
  const accessToken = JWT.sign(payload, jwtSecret);
  return {
    accessToken,
    expiresIn: payload.exp,
    tokenType: 'Bearer'
  };
};

userSchema.methods.verifyPassword = function(providedPassword) {
  return bcrypt.compareSync(providedPassword, this.password);
};

/**
 * Check whether the error message is for email already exist.
 * @param {*} error Error message
 * @returns True or false if the email address already exist.
 */
 userSchema.statics.checkDuplicateEmail = (error) => {
  if (error.code === 11000) {
    return new APIError({
      message: 'Email already in use',
      errors: [
        {
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        },
      ],
      status: httpStatus.CONFLICT,
      isPublic: true,
      stack: error.stack,
    });
  }
  return error;
};

userSchema.statics.transform = (user) => {
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.statics.findByEmail = async function ({email, exist}) {
  const user = await this.findOne({ email });

  const error = {
    status: httpStatus.NOT_FOUND,
    message: 'Email does not exist',
  };

  if (user || !exist) {
    return user;
  }

  throw new APIError(error);
};

userSchema.statics.authenticateUser = async function ({ email, password }) {
  const user = await this.findOne({ email }).select('+password');

  const error = {
    status: httpStatus.UNAUTHORIZED,
    message: 'Incorrect email or password',
  };

  if (user && user.verifyPassword(password)) {
    return user;
  }

  throw new APIError(error);
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
