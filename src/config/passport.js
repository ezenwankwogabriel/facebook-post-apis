const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const APIError = require('../api/utils/APIError');
const httpStatus = require('http-status');

const UserModel = require('../api/models/user.model');
const { 
  jwtSecret, 
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET 
} = require('./vars');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await UserModel.findById(payload.id);

    if (user) return done(null, user);

    return done(null, false);
  } catch (error) {
    const apiError = new APIError({
      message: error ? error.message : 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
      stack: error ? error.stack : undefined
    });
    return done(apiError);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
