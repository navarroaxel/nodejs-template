var mongodb = require('mongodb');

module.exports = store = function (collectionName, cb) {
    store.exec(function (err_db, db) {

        if (err_db) {
            tryCloseConnection(db);
            return cb(err_db);
        }

        db.collection(collectionName, function (err_collection, collection) {
            cb(err_collection, collection, db);
        });
    });
};

store.exec = function (cb) {
    if (!store.connectionString) {
        throw 'Please set the connectionstring...';
    }

    mongodb.Db.connect(store.connectionString, cb);
};

store.add = function (collectionName, doc, add_cb) {
    store(collectionName, function (err, collection, db) {

        if (err) {
            tryCloseConnection(db);
            return add_cb(err);
        }

        if (doc.id && doc.id != 0) {
            doc["_id"] = doc.id;
        }

        collection.insert(doc, function (err_insert, result) {
            tryCloseConnection(db);

            if (err_insert || !result) {
                return add_cb(err_insert, result);
            }

            add_cb(err, result[0])
        });
    });
};

store.update = function (collectionName, doc, update_cb) {
    store(collectionName, function (err, collection, db) {

        if (err) {
            return update_cb(err);
        }

        if (doc.id && doc.id != 0) {
            doc._id = doc.id;
        }

        var mongoId = doc._id;

        delete doc._id;

        collection.update(
            { _id: mongoId },
            { $set: doc },
            { upsert: true, safe: true },
            function (err_update, result) {

                db.close();

                if (err_update || !result) {
                    update_cb(err_update, result);
                    return;
                }

                doc._id = mongoId;

                update_cb(err_update, doc);
            });
    });
};

store.findOne = function (collectionName, selector, get_cb) {
    store(collectionName, function (err, collection, db) {

        if (err) {
            return get_cb(err);
        }

        collection.findOne(selector, function (find_err, result) {
            tryCloseConnection(db);

            if (find_err) {
                return get_cb(find_err);
            }

            get_cb(null, result);
        });
    });
};

store.objectId = function (id) {
    var BSON = mongodb.BSONPure;
    var o_id;

    try {
        o_id = new BSON.ObjectID(id.toString());
    }
    catch (e) {
    }

    return o_id;
};

store.findOneById = function (collectionName, id, get_cb) {
    store(collectionName, function (err, collection, db) {

        if (err) {
            return get_cb(err);
        }

        collection.findOne({ _id: store.objectId(id) }, function (find_err, result) {
            tryCloseConnection(db);
            get_cb(find_err, result);
        });
    });
};

store.find = function (collectionName, selector, get_cb) {
    if (typeof selector == 'function') {
        //then selector is the callback and there is no selector.
        get_cb = selector;
        selector = null;
    }

    store(collectionName, function (err, collection, db) {
        if (err) {
            return get_cb(err);
        }

        collection.find(selector).toArray(function (find_err, result) {
            tryCloseConnection(db);
            get_cb(find_err, result);
        });
    });
};

store.removeById = function (collectionName, id, remove_cb) {
    store(collectionName, function (err, collection, db) {
        if (err) {
            return remove_cb(err);
        }

        collection.remove({ _id: store.objectId(id) }, function (find_err, numberOfRemovedDocs) {
            tryCloseConnection(db);
            remove_cb(find_err, numberOfRemovedDocs);
        });
    });
};

var tryCloseConnection = function (db) {
    try {
        db.close();
    }
    catch (e) {
    }
};