define(function (require, exports, module) {
    var b = require('b');
    exports.prop = 'prop result';
    exports.method = function () {
        return 'method result';
    };
    exports.depends = b;
});