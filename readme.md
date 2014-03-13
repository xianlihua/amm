## amm.js

amm (async module manager) 是一个适用于浏览器端的 AMD/CMD 模块加载器，功能简单，满足基本需求，其主要代码实现来自 [sea.js](http://www.seajs.org/ "seajs"), 表示感谢。

## 构建代码

需要配置 [Node.js](http://nodejs.org/ "Node.js") 环境

```bash
> npm install amm.js
> cd amm.js
> npm start
```

或者直接通过 `git` 拉取本项目到本地，执行下面的命令:

```bash
> git clone https://github.com/xianlihua/amm.js
> cd amm.js
> npm start
```

构建之后项目根目录下会生成 `lib/amm.js` 和 `lib/amm.min.js` 两个最终文件

## 使用示例

index.html:

```html
<DOCTYPE html>
<html>
<head>
<title>amm.js sample</title>
<script src="amm.js"></script>
</head>
<body>
<script>
amm.use(['math'], function (math) {
    alert(math.add(1, 2)); // 3
});
</script>
</body>
</html>
```

math.js:

```js
define(function (require, exports, module) {
    exports.add = function (a, b) {
        return a + b;
    };
});
```
