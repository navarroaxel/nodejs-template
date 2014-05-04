var fs = require('fs'),
    express = require('express');

function loadModules(folder, router) {
    // Loading modules dynamically
    fs.readdirSync(folder)
        .filter(function (file) {
            return file.indexOf('.') == -1 && file.indexOf("api.") == -1;
        }).forEach(function (module) {
            console.log('Loading', module, 'api...');
            router.use(require('./' + module)(express.Router()));
        });
}

module.exports = function (router) {
    loadModules('./routes/api', router);
    return router;
};