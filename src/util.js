/* utilities */
var util = {
    'uid': function (prefix) {
        return (prefix || '') + (++uniqueId);
    },

    'extend': function (target) {
        if (target !== Object(target)) {
            return target;
        }

        var i = 0, sources = [].slice.call(arguments, 1), len = sources.length;
        for (; i < len; i++) {
            for (var key in sources[i]) {
                if (Object.prototype.hasOwnProperty.call(sources[i], key) === true) {
                    target[key] = sources[i][key];
                }
            }
        }

        return target;
    }
};

// 清理数组中的空项
function clean (item) {
    return item || false;
}

function setAlias (alias) {
    defaults.alias = util.extend({}, defaults.alias, alias);
}

function setPreload (preload) {
    defaults.preload = defaults.preload.concat(preload);
}

function setBase (base) {
    defaults.base = base;
}
