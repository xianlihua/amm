define('a-module-exports', function (require, exports, module) {
    module.exports = {
        'method': function () {
            return 'method result';
        },

        'prop': 'prop result'
    };
});