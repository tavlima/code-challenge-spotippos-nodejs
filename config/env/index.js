var config;

if (process.env.NODE_ENV === 'production') {
    // debug('Using production configuration file!');
    config = require('./production');

} else if (process.env.NODE_ENV === 'staging') {
    // debug('Using staging configuration file!');
    config = require('./staging');

} else {
    // debug('Using development configuration file!');
    config = require('./development');
}

module.exports = config;