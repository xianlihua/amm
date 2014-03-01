var path = {};

path.dirname = function (path) {
    return path.match(/[^?#]+[\/\\]/)[0];
};

path.basename = function (path) {
    var paths = path.split('/');
    var basename;
    while (basename = paths.pop()) {
        return basename;
    }
};

path.resolve = function (path) {
    if (!path) {
        return;
    }

    if (path.indexOf('http://') !== 0) {
        path = defaults.base + path;
    }

    path = path.replace(/\\/g, '/').replace(/\/{2,}/g, '//');
    return (path.slice(-3) === '.js' || path.indexOf('?') > -1) ? path : path + '.js';
};
