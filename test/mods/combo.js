define('mods/combo', ['mods/anything1', 'mods/anything2'], function (require, exports, module) {
    var anything1 = require('mods/anything1');
    var anything2 = require('mods/anything2');

    exports.combo = [anything1, anything2];
});

define('mods/anything1', [], function (require, exports, module) {
    return "anything1";
});

define('mods/anything2', ['mods/anything1'], function (require, exports, module) {
    var anything1 = require('mods/anything1');
    module.exports = anything1 + ':anything2';
});

