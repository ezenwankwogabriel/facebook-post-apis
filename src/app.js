require('dotenv').config();
require('dotenv-safe').config();

Promise = require('bluebird'); // eslint-disable-line no-global-assign
const logger = require('./config/logger');
const port = process.env.PORT || 3000;


// startup db
require('./config/db')();

const app = require('./config/express');

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});

/**
* Exports express
* @public
*/
module.exports = app;