var debug = require('debug')('permission');

/**
 * Returns a middleware that checks the permission in the user's session
 * @param permission
 * @returns (Function) A middleware that check the user's permission.
 */
module.exports = function (permission) {
    return function (req, res, next) {
        if (permission && req.user.permissions.indexOf(permission) == -1) {
            debug('User has no permission');
            if (req.xhr) {
                // If ajax.
                return res.json(403, { message: 'You don\'t have permission to perform this action.'});
            }
            return res.redirect(app.config.auth.loginPage);
        }
        next();
    }
};