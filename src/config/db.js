const mongoose = require('mongoose');
const logger = require('./logger');
let { DB_NAME } = process.env;

//  DB Connection =============================================================
function dbConnect() {
  mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
    useNewUrlParser: true,
  }, (err) => {
    if (err) {
      logger.error('database connection error', err);
    } else {
      logger.info('database connection successful');
    }
  });
}
module.exports = dbConnect;
