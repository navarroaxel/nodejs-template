var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var model = module.exports;

model.Company = mongoose.model('Company', new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    timezone: { type: Number, required: true, default: 0 }
}));

model.User = mongoose.model('User', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: true }
}));

model.Layout = mongoose.model('Layout', new Schema({
    company: { type: ObjectId, ref: 'Company', required: true },
    editor: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    footer: { type: String, required: true },
    footerBackgroundColor: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false }
}).plugin(timestamps));

loadModelExtensions('./model', model);

function loadModelExtensions(folder, model) {
    // Loading entities dynamically
    require('fs').readdirSync(folder)
        .filter(function (e) {
            return e.indexOf("index.js") == -1;
        }).forEach(function (entity) {
            console.log('Loading', entity, 'entity...');
            require('./' + entity)(model);
        });
}