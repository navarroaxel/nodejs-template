var mongoose = require('mongoose');

module.exports.connect = function (cs, cb) {
    mongoose.connection.on('error', function () {
        cb('Error connecting DB!');
    });

    mongoose.connection.once('open', function () {
        cb(null, mongoose.connection);
    });

    mongoose.connect(cs);
};