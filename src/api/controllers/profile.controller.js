
exports.getUser = async (req, res, next) => {
  try {
    return res.json({user: req.user});
  } catch (error) {
    return next(error);
  }
};