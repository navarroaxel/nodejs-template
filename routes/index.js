var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    _ = require('lodash');

module.exports = function (router) {
    var ignoreList = ['.DS_Store'];
    router.get('/back', app.security.authenticate(), function (req, res, next) {
        fs.readFile('./public/views/back.html', function (err, data) {
            if (err) {
                return next(Error.create('An error occurred trying load the dashboard', null, err));
            }

            // 1. Filters
            fs.readdir('./public/filters', function (err, files) {
                if (err) {
                    return next(Error.create('An error occurred trying to load the filters', null, err));
                }

                var filters = files.filter(function (f) {
                    return !_.contains(ignoreList, f);
                }).map(function (f) {
                    return '<script src="filters/' + f + '" type="text/javascript"></script>'
                });

                // 2. Services
                fs.readdir('./public/services', function (err, files) {
                    if (err) {
                        return next(Error.create('An error occurred trying to load the services.', null, err));
                    }

                    var services = files.filter(function (f) {
                        return !_.contains(ignoreList, f);
                    }).map(function (f) {
                        return '<script src="services/' + f + '" type="text/javascript"></script>'
                    });

                    // 3. Directives
                    fs.readdir('./public/directives', function (err, files) {
                        if (err) {
                            return next(Error.create('An error occurred trying to load the directives.', null, err));
                        }

                        var directives = files.filter(function (f) {
                            return !_.contains(ignoreList, f);
                        }).map(function (f) {
                            if (f.indexOf('.js') != -1) {
                                return '<script src="directives/' + f + '" type="text/javascript"></script>';
                            }

                            return '<script src="directives/' + f + '/index.js" type="text/javascript"></script>';
                        });

                        // 4. Controls
                        fs.readdir('./public/controls', function (err, files) {
                            if (err) {
                                return next(Error.create('An error occurred trying to load the controls.', null, err));
                            }

                            var controls = files.filter(function (f) {
                                return !_.contains(ignoreList, f);
                            }).map(function (f) {
                                return '<script src="controls/' + f + '/index.js" type="text/javascript"></script>';
                            });

                            // 5. Controllers
                            fs.readdir('./public/controllers', function (err, files) {
                                if (err) {
                                    return next(Error.create('An error occurred trying to load the services.', null, err));
                                }

                                var steps = files.filter(function (f) {
                                    return !_.contains(ignoreList, f);
                                }).filter(function (f) {
                                    return !_.contains(f, '.js');
                                }).map(function (f) {
                                    return function (finish) {
                                        fs.readdir('./public/controllers/' + f, function (err, files) {
                                            if (!files || err) {
                                                return finish(err);
                                            }

                                            finish(null, files.filter(function (f) {
                                                return !_.contains(ignoreList, f);
                                            }).map(function (file) {
                                                return f + '/' + file;
                                            }));
                                        });
                                    }
                                });

                                async.parallel(steps, function (err, result) {
                                    var controllerFiles = result.join().split(',');

                                    if (err) {
                                        return next(Error.create('An error occurred trying to load the controllers.', null, err));
                                    }

                                    var controllers = controllerFiles.map(function (f) {
                                        return '<script src="controllers/' + f + '" type="text/javascript"></script>';
                                    });

                                    data = data.toString().replace(/<%filters%>/, filters.join('\n'));
                                    data = data.toString().replace(/<%services%>/, services.join('\n'));
                                    data = data.toString().replace(/<%directives%>/, directives.join('\n'));
                                    data = data.toString().replace(/<%controls%>/, controls.join('\n'));
                                    data = data.toString().replace(/<%controllers%>/, controllers.join('\n'));

                                    res.set('Content-Type', 'text/html');
                                    res.send(data);
                                })
                            });
                        });
                    });
                });
            });
        });
    });

    router.get('/', function (req, res, next) {
        res.render('index');
    });

    router.get('/signin', function (req, res, next) {
        res.render('signin');
    });

    router.get('/signout', function (req, res, next) {
        delete req.session.user;
        res.redirect(app.config.auth.loginPage);
    });

    console.log('Loading public-api...');
    router.use('/public-api', require('./public-api')(express.Router()));

    router.use('/api',
        require('./api')(express.Router()
                .use(app.security.authenticate())
                .use(require('./companyMiddleware.js')())
        ));
};