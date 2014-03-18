/*! amm (async module manager) - v0.0.3 */
(function (root) {
    "use strict";
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

// 命名空间
var amm = root.amm = {};

var doc = root.document;
var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;

// 唯一ID
var uniqueId = 0;

// script onload 之后保存 meta 信息
var anonymousMeta;

// 模块缓存
var cache = {};

// 模块状态常量
var STATUS = {
    'INITIALIZED': 0,
    'FETCHING': 1,
    'SAVED': 2,
    'LOADING': 3,
    'LOADED': 4,
    'EXECUTTING': 5,
    'EXECUTED': 6
};

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

// 默认配置
var defaults = {
    'base': path.dirname(doc.URL),
    'alias': {},
    'preload': []
};

/* module.js */
function Module (url, deps) {
    if (deps && !Array.isArray(deps)) {
        deps = [deps];
    }

    // 模块 url
    this.url = url;

    // 依赖及未完成的依赖数量
    this.dependencies = (deps || []).filter(clean);
    this.remain = this.dependencies.length;

    // 模块初始状态
    this.status = STATUS.INITIALIZED;

    // 默认导出
    this.exports = null;

    // 依赖本模块的模块
    this.waitings = {};
}

// 请求下载模块
Module.prototype.fetch = function () {
    var mod = this;
    var url = mod.url;

    if (mod.status >= STATUS.FETCHING) {
        return;
    }


    mod.status = STATUS.FETCHING;

    request(url, function () {
        if (anonymousMeta) {
            Module.save(url, anonymousMeta);
            anonymousMeta = null;
        }

        mod.load();
    });
};

// 加载依赖及改变依赖状态
Module.prototype.load = function () {
    var mod = this;

    if (mod.status > STATUS.LOADING) {
        return;
    }
    mod.status = STATUS.LOADING;

    var deps = mod.dependencies;
    var len = mod.remain = deps.length;
    var waitings = mod.waitings;
    var i, url, m;


    // 初始化依赖模块
    for (i = 0; i < len; i++) {
        url = Module.resolve(deps[i]);
        m = Module.get(url);
        if (m.status < STATUS.LOADED) {
            m.waitings[mod.url] = (m.waitings[mod.url] || 0) + 1;
        } else {
            mod.remain--;
        }
    }

    if (mod.remain <= 0) {
        return mod.onload();
    }

    // 获取、加载依赖模块
    for (i = 0; i < len; i++) {
        url = Module.resolve(deps[i]);
        m = Module.get(url);
        if (m.status < STATUS.FETCHING) {
            m.fetch();
        } else if (m.status === STATUS.SAVED) {
            m.load();
        }
    }
};

// 依赖加载完毕
Module.prototype.onload = function () {
    var mod = this;

    mod.status = STATUS.LOADED;


    if (mod.callback) {
        return mod.callback();
    }

    var waitings = mod.waitings;
    var deps = mod.deps;

    // 依赖本模块的模块
    for (var url in waitings) {
        if (waitings.hasOwnProperty(url)) {
            var m = cache[url];
            m.remain -= waitings[url];
            if (m.remain <= 0) {
                m.onload();
            }
        }
    }
};

// 执行模块并返回模块的输出
Module.prototype.exec = function () {
    var mod = this;
    var url = mod.url;

    if (mod.status >= STATUS.EXECUTTING) {
        return mod.exports;
    }
    mod.status = STATUS.EXECUTTING;

    function require (id) {
        var url = Module.resolve(id);
        return Module.get(url).exec();
    }

    var factory = mod.factory;
    var exports = typeof factory === 'function' ? factory(require, mod.exports = {}, mod) : factory;

    if (exports === undefined) {
        exports = mod.exports;
    }

    mod.exports = exports;
    mod.status = STATUS.EXECUTED;

    return exports;
};

// 处理 id 返回正规化的 url
Module.resolve = function (id) {
    // 临时 url
    if (/_(use|preload)_\d+$/.test(id)) {
        return id;
    }

    return path.resolve(defaults.alias[id] || id);
};

// 分析模块依赖
var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;
var SLASH_RE = /\\\\/g;
Module.parseDependencies = function (code) {
    var ret = [];
    code.replace(SLASH_RE, "").replace(REQUIRE_RE, function(m, m1, m2) {
        if (m2) {
            ret.push(m2);
        }
    });
    return ret;
};

// 获取模块的元数据
Module.get = function (url, deps) {
    return cache[url] || (cache[url] = new Module(url, deps));
};

// 模块定义后保存元数据信息
Module.save = function (url, meta) {
    var mod = Module.get(url);

    if (mod.status < STATUS.SAVED) {
        mod.url = url;
        mod.dependencies = meta.deps || [];
        mod.factory = meta.factory;
        mod.status = STATUS.SAVED;
        return;
    }

    throw new Error('override module: ' + mod.url);
};

// 加载并执行依赖模块
Module.use = function (ids, callback, url) {
    var mod = Module.get(url, ids);
    mod.callback = function () {
        var deps = mod.dependencies;
        var exports = [];

        for (var i = 0, len = deps.length; i < len; i++) {
            var url = Module.resolve(deps[i]);
            exports[i] = cache[url].exec();
        }

        if (callback) {
            callback.apply(null, exports);
        }

        delete mod.callback;
    };
    mod.load();
};

// 预加载模块
Module.preload = function (callback) {
    var preloads = defaults.preload || [];
    if (!preloads.length) {
        return callback();
    }

    function afterLoad () {
        defaults.preload = [];
        callback();
    }

    Module.use(preloads, afterLoad, defaults.base + '_preload_' + util.uid());
};

/**
 * define
 * define 函数定义一个模块，执行时初始化模块的元数据。
 *
 * 需要注意的是，模块初始化并不执行模块功能函数，只有在需要的时候再执行，这样可以有效提升效率
 *
 * @param  {String} id           模块标识
 * @param  {Array} dependencies 声明依赖的模块
 * @param  {Function} factory      模块功能函数
 */
function define (id, dependencies, factory) {
    var args = arguments.length;
    // define(factory)
    if (args === 1) {
        factory = id;
        id = undefined;
    } else if (args === 2) {
        factory = dependencies;
        // define(dependencies, factory)
        if (Array.isArray(id)) {
            dependencies = id;
            id = undefined;
        // define(id, factory)
        } else {
            dependencies = undefined;
        }
    }

    if (!Array.isArray(dependencies) && typeof factory === 'function') {
        dependencies = Module.parseDependencies(factory.toString());
    }


    var meta = {
        'id': id,
        'url': Module.resolve(id),
        'deps': dependencies,
        'factory': factory
    };

    if (!meta.url && doc.attachEvent) {
        var script = getCurrentScript();
        if (script) {
            meta.url = script.src.replace(/\/{2,}/g, '//');
        }
    }

    if (meta.url) {
        Module.save(meta.url, meta);
    } else {
        anonymousMeta = meta;
    }
}

function use (dependencies, callback) {
    if (!Array.isArray(dependencies)) {
        dependencies = [dependencies];
    }

    Module.preload(function () {
        Module.use(dependencies, callback, defaults.base + '_use_' + util.uid());
    });
}

define.amd = {'jQuery': true};

var currentlyAddingScript, interactiveScript;

function request (url, callback, charset) {
    var script = doc.createElement('script');
    script.async = 'async';
    script.charset = charset || 'utf-8';
    script.onload = script.onerror = script.onreadystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onerror = script.onreadystatechange = null;
            script.parentNode.removeChild(script);
            script = null;
            callback();
        }
    };
    script.src = url;
    currentlyAddingScript = script;
    head.appendChild(script);
    currentlyAddingScript = null;
}

function getCurrentScript() {
    if (currentlyAddingScript) {
        return currentlyAddingScript;
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === "interactive") {
        return interactiveScript;
    }

    var scripts = head.getElementsByTagName("script");

    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === "interactive") {
            interactiveScript = script;
            return interactiveScript;
        }
    }
}

// exports
root.define = define;
amm.use = use;
amm.define = define;
amm.alias = setAlias;
amm.preload = setPreload;
amm.base = setBase;
amm.cache = cache;
})(this);