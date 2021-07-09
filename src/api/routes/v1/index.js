const express = require('express');
const authRoutes = require('./auth.route');
const postRoutes = require('./posts.route');
const profileRoutes = require('./profile.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * Use v1/profile for profile routes
 */
router.use('/profile', profileRoutes);

/**
 * Use v1/auth for user authentication routes
 */
router.use('/auth', authRoutes);

/**
 * Use v1/post for facebook post routes
 */
 router.use('/post', postRoutes);

module.exports = router;
