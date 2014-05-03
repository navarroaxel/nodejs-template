var crypto = require('crypto');

module.exports = function (password) {
    return crypto.createHash('sha1')
        .update(password.toLowerCase())
        .digest('hex');
};
