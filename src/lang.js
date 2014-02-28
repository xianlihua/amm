if (!Array.isArray) {
    Array.isArray = function (array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (filter) {
        var i = 0, len = this.length, result = [], item;
        if (len === 0) {
            return this;
        }

        for (; i < len; i++) {
            item = this[i];
            if (filter(item, i, this)) {
                result.push(item);
            }
        }

        return result;
    };
}
