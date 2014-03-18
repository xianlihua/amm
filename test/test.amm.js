// amm.base('./');
amm.alias({
    'a-exports': 'mods/a-exports.js',
    'a-module-exports': 'mods/a-module-exports.js',
    'a-return': 'mods/a-return.js',
    'a-no-factory': 'mods/a-no-factory.js',
    'a-exports-anonymous': 'mods/a-exports-anonymous.js',
    'a-module-exports-anonymous': 'mods/a-module-exports-anonymous.js',
    'a-return-anonymous': 'mods/a-return-anonymous.js',
    'a-no-factory-anonymous': 'mods/a-no-factory-anonymous.js',
    'a': 'mods/a.js',
    'b': 'mods/b.js'
});

test('基本依赖测试: exports', function (assert) {
    stop();
    amm.use(['a-exports'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('基本依赖测试: module.exports', function (assert) {
    stop();
    amm.use(['a-module-exports'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('基本依赖测试: return', function (assert) {
    stop();
    amm.use(['a-return'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('基本依赖测试: no factory', function (assert) {
    stop();
    amm.use(['a-no-factory'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('匿名模块依赖测试: exports', function (assert) {
    stop();
    amm.use(['a-exports-anonymous'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('匿名模块依赖测试: module.exports', function (assert) {
    stop();
    amm.use(['a-module-exports-anonymous'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('匿名模块依赖测试: return', function (assert) {
    stop();
    amm.use(['a-return-anonymous'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('匿名模块依赖测试: no factory', function (assert) {
    stop();
    amm.use(['a-no-factory-anonymous'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('多次依赖(use)同一个模块', function (assert) {
    stop();
    amm.use(['a-no-factory-anonymous'], function (aExports) {
        start();
        assert.equal(aExports.prop, 'prop result');
        assert.equal(typeof aExports.method, 'function');
    });
});

test('同时依赖多个模块(module.exports & no-factory-anonymous)', function (assert) {
    stop();
    amm.use(['a-module-exports', 'a-no-factory-anonymous'], function (module, anonymous) {
        start();
        assert.equal(module.prop, 'prop result');
        assert.equal(anonymous.prop, 'prop result');
        assert.equal(typeof module.method, 'function');
        assert.equal(typeof anonymous.method, 'function');
    });
});

test('输出依赖模块的输出值 amm.use -> a -> b', function (assert) {
    stop();
    amm.use(['a'], function (a) {
        start();
        assert.equal(a.prop, 'prop result');
        assert.equal(a.method(), 'method result');
        assert.equal(a.depends, 'b module result');
    });
});

test('无 alias 设置应该能正确找到模块', function (assert) {
    stop();
    amm.use(['mods/math'], function (math) {
        start();
        assert.equal(math.add(1, 2), 3);
    });
});

test('入口仅 use 一个模块时，支持传入字符串表示', function (assert) {
    stop();
    amm.use('mods/math', function (math) {
        start();
        assert.equal(math.add(3, 2), 5);
    });
});

test('简单的模块合并', function (assert) {
    stop();
    amm.use('mods/combo', function (c) {
        var combo = c.combo;
        start();
        assert.equal(combo[0], 'anything1');
        assert.equal(combo[1], 'anything1:anything2');
    });
});
