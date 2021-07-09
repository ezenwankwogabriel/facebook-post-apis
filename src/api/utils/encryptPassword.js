const bcrypt = require('bcryptjs');

/**
 * Encrypts a provided password using bcryptjs;
 * Returns a hash;
 * 
 * @param {string} providedPassword password to be passworded
 * @return {string} passsword hash
*/
function encryptPassword(providedPassword) {
  
  const salt = bcrypt.genSaltSync(10);
  const encrypted = bcrypt.hashSync(providedPassword, salt);
  return encrypted;
}

module.exports = encryptPassword;
