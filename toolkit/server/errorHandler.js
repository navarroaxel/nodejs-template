/**
 * Returns a middleware that logs the http 500 errors into the db
 * and response an error message to the client.
 */
module.exports = function (error, req, res, next) {
    var status = error.status || 500;
    var msg = error.message || 'Unknown error';

    if (status != 500) {
        var info = error.data || {};
        info.message = msg;
        return res.json(status, info);
    }

    if (app.config.mode == 'dev') {
        console.log(error);
    }
    app.log.error(error, function (err, traceId) {
        var info = { message: error.message || 'Unknown error' };

        if (traceId) {
            info.traceId = traceId;
        }
        res.json(status, info);
    });
};