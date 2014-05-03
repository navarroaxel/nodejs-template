module.exports = function (model) {
    var Company = model.Company;
    // assign a function to the "methods" object of our company
    // for more info about instance methods visit http://mongoosejs.com/docs/guide.html#methods
    Company.schema.methods.findUsers = function (cb) {
        app.model.User.find({company: this._id}, cb);
    };

    // assign a function to the "statics" object of our Company
    // for more info about instance methods visit http://mongoosejs.com/docs/guide.html#statics
    Company.schema.statics.findByName = function (name, cb) {
        this.find({ name: new RegExp(name, 'i') }, cb);
    };
};