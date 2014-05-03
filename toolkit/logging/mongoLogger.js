var logger = module.exports;

logger.error = function (err, cb) {
    app.data.mongoClient.add('errors', Error.toJson(err), function (err, doc) {
        if (cb) {
            cb(null, doc._id);
        }
    });
};

logger.info = function (info) {
    app.data.mongoClient.add('info', info, function (err, doc) {
    });
};