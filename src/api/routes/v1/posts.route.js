const express = require('express');
const { validate } = require('express-validation');
const passport = require('passport');

const postController = require('../../controllers/post.controller');
const { 
  publishValidation,
  deleteValidation,
  updateValidation,
  commentValidation,
  uploadValidation
} = require('../../validations/post.validation');

const router = express.Router();

// authenticate routes on this section
router.use(passport.authenticate('jwt', { session: false }));

/**
 * Publish a Post
 * @api {post} v1/posts
 */
router.route('/')
  .post(validate(publishValidation), postController.publishPost);

/**
 * Fetch posts
 * @api {post} v1/posts 
 */
router.route('/')
  .get(postController.fetchPosts);

/**
 * Delete a post
 * @api {delete} v1/posts 
 */
 router.route('/:pagePostId')
  .delete(validate(deleteValidation), postController.deletePost);

/**
 * Edit a post
 * @api {put} v1/posts
 */
 router.route('/:pagePostId')
  .put(validate(updateValidation), postController.updatePost);

/**
 * Comment on a post
 * @api {post} v1/posts/comment
 */
 router.route('/:pagePostId/comment')
  .put(validate(commentValidation), postController.commentOnPost);

/**
 * Upload an image
 * @api {post} v1/posts/comment
 */
 router.route('/:pagePostId/upload')
  .put(validate(uploadValidation), postController.uploadOnPost);

module.exports = router;