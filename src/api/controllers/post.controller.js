const httpStatus = require('http-status');
const { 
  publishPost,
  fetchPosts,
  deletePost,
  updatePost,
  commentOnPost,
  uploadPost
 } = require('../service/post.service');

/**
 * Publish a post
 * @public
 * @returns post id
 */ 
exports.publishPost = async (req, res, next) => {
  try {
    const registerUserService = await publishPost(req.body);

    res.status(httpStatus.CREATED);
    return res.json(registerUserService);
  } catch (error) {
    return next(error);
  }
};

/**
 * Fetch posts
 * @public
 * @returns list of posts
 */ 
 exports.fetchPosts = async (req, res, next) => {
  try {
    const fetchPostsService = await fetchPosts();

    return res.json(fetchPostsService);
  } catch (error) {
    return next(TypeError);
  }
};

/**
 * Deletes a post
 * @public
 * @returns 
 */ 
 exports.deletePost = async (req, res, next) => {
  try {
    const deletePostService = await deletePost(req.params);

    return res.json(deletePostService);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a post
 * @public
 * @returns boolean success
 */ 
 exports.updatePost = async (req, res, next) => {
  try {
    const updatePostService = await updatePost(req.params, req.body);

    return res.json(updatePostService);
  } catch (error) {
    return next(error);
  }
};

/**
 * Comments on a post
 * @public
 * @returns post id
 */
exports.commentOnPost = async (req, res, next) => {
  try {
    const commentOnPostService = await commentOnPost(req.params, req.body);

    return res.json(commentOnPostService);
  } catch (error) {
    return next(error);
  }
};

/**
 * Upload image on post
 * @public
 * @returns post id
 */
 exports.uploadOnPost = async (req, res, next) => {
  try {
    const uploadOnPostService = await uploadPost(req.params, req.body);

    return res.json(uploadOnPostService);
  } catch (error) {
    return next(error);
  }
};
