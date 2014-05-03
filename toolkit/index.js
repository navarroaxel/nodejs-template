// abc application system framework 0.1
require('colors');
var fs = require('fs');

// Extensions
require('./extensions/errorExtensions');

global.app = { version: 0.1 };

app.data = require('./data');
app.log = require('./logging/mongoLogger');
app.server = require('./server');
app.validation = require('./validation');
app.security = require('./security');

app.start = function () {
    console.log('Starting application...'.cyan);

    readConfig(function (err, config) {
        if (err) {
            return console.log('[Error] '.red + err);
        }

        // 1. Add Config
        app.config = config;

        // 2. Setup mongoose client
        app.data.mongoClient.connectionString = config.connectionString;

        // 3. Connecting Model Database
        app.data.moongoseClient.connect(config.connectionString, function (err) {
            if (err) {
                return console.log('[Error]'.red + ' Error connecting database: ' + err.message);
            }

            app.model = require('../model/index.js');

            app.server.start();
        });
    });
};

var readConfig = function (cb) {
    fs.readFile('./config.json', function (err, data) {
        if (err) {
            return cb('Missing config.json file.');
        }

        try {
            cb(null, JSON.parse(data.toString()));
        } catch (e) {
            cb('Error reading config.json file: ' + e.message);
        }
    });
};
