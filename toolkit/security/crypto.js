var crypto = require('crypto');

module.exports = {
    hash: function (input, encoding) {
        return crypto.createHash('sha256').update(input).digest(encoding || app.config.crypto.encoding);
    },
    encrypt: function (input, encoding) {
        encoding = encoding || app.config.crypto.encoding;
        var cipher = crypto.createCipheriv('aes-256-cbc', app.config.crypto.key, app.config.crypto.iv);
        return cipher.update(input, 'utf8', encoding) + cipher.final(encoding);
    },
    decrypt: function (input, encoding) {
        encoding = encoding || app.config.crypto.encoding;
        var decipher = crypto.createDecipheriv('aes-256-cbc', app.config.crypto.key, app.config.crypto.iv);
        return decipher.update(input, encoding, 'utf8') + decipher.final('utf8');
    }
};