const express = require('express');
const passport = require('passport');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

// authenticate routes on this section
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @api {get} v1/profile/me Get User
 */
router.route('/me')
  .get(profileController.getUser);

module.exports = router;