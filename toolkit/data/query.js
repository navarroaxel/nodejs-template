var query = module.exports;

query.caseInsensitive = function (pattern) {
    return new RegExp(pattern, 'i');
};

query.like = function (pattern) {
    return new RegExp('.*' + pattern + '.*', 'i');
};