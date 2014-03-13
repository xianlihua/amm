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
