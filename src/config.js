// 默认配置
var defaults = {
    'base': path.dirname(doc.URL),
    'alias': {
        'jquery': 'http://s0.qhimg.com/lib/jquery/172.js',
        'json': 'http://s5.qhimg.com/!0a0a5999/json2.js',
        'es5-safe': 'http://s0.qhimg.com/!419dd8c9/es5-safe.js'
    },
    'preload': [!root.JSON ? 'json' : '', !Function.prototype.bind ? 'es5-safe' : '']
};