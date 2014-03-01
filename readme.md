## miss.js

missjs 是一个适用于浏览器端的 AMD/CMD 模块加载器，功能简单，满足基本需求，其主要代码实现来自 [sea.js](http://www.seajs.org/ "seajs"), 表示感谢。

## 构建代码

发布的源码仅包含源文件 `src/` 及单元测试，如果需要生成使用的 miss.js 文件，需要配置 [Node.js](http://nodejs.org/ "Node.js") 环境

```bash
> npm install miss.js
> cd miss.js
> npm start
```

或者直接通过 `git` 拉取本项目到本地，执行下面的命令:

```bash
> git clone https://github.com/xianlihua/miss.js
> cd miss.js
> npm start
```

构建之后项目根目录下会生成 `lib/miss.js` 和 `lib/miss.min.js` 两个最终文件

## 使用示例

index.html:

```html
<DOCTYPE html>
<html>
<head>
<title>miss.js sample</title>
<script src="miss.js"></script>
</head>
<body>
<script>
miss.use(['math'], function (math) {
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
