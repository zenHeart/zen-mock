const path = require('path');
const fs = require('fs');
const debug = require('debug')('zm:utils');

/**
 * 允许不配置文件返回默认配置项
 * TODO:后续支持不配置 .zenmock 文件进行测试的功能
 */
exports.readConfig = function () {
    const CONFIG_FILE = '.zenmock';
    //从项目根目录读取配置文件
    let fileName = path.resolve(CONFIG_FILE);
    try {
        let config = require(fileName);
        return config;
    } catch (e) {
        throw new Error('确保在项目根目录运行命令,且配置了 .zenmock 文件')
    }
}


exports.flattenObjToJsonType = flattenObjToJsonType;
/**
 * TODO:此函数后期看是否可使用尾调优化
 * 
 * 扁平化数据对象并返回对应 json 类型,注意由于处理的是 api 的数据,所以对于数组
 * 只返回第一项结构即可.
 * 
 * 假设 api 返回 {a:1,b:{c:1}}
 * 则对应的字段结构为 {a:'number',b:'object','b.c':'number'}
 * 假设 api 返回 {a:1,b:[{a:1},{a:2}]}
 * 则对应的字段结构为 {a:'number',b:'array','b.0.a':'number'}
 * @param {object} obj 传入的转换对象
 * @param {key} string 对应的键名
 * @param {parentKey} string 对应的父键名
 * 
 */
function flattenObjToJsonType(obj) {
    let items = {};

    if (typeof obj === 'object' && obj !== null) { //
        let keys = Object.keys(obj);
        if (!Array.isArray(obj)) { //非数组遍历所有键
            keys.forEach(key => {
                //递归扁平化内部对象
                let flatObj = flattenObjToJsonType(obj[key]);
                let childrenKeys = Object.keys(flatObj);

                if (childrenKeys.length) {
                    childrenKeys.forEach(childrenKey => {
                        items[key + '.' + childrenKey] = flatObj[childrenKey];
                    })
                }
                items[key] = getJsonType(obj[key]);
            })
        } else {
            //只处理第一项内容
            let flatObj = flattenObjToJsonType(obj[0]);
            let childrenKeys = Object.keys(flatObj);
            if (childrenKeys.length) { //如果内部可遍历
                childrenKeys.forEach(childrenKey => {
                    items['0.' + childrenKey] = flatObj[childrenKey];
                })
            }
            items['0'] = getJsonType(obj[0]); ;
        }
    }
    else {
      //基础类型不做任何处理
    }
    return items;
}


exports.getJsonType = getJsonType;
/**
 * 该函数用于获取 api 返回数据的 json 类型
 * 由于 json 不存在原始封装类型和函数类型,所以此处无需对此类型做处理.
 * 注意此处不是完全类比 json 区别如下
 * true,false 返回 boolean 类型
 * null 返回 object 类型
 * 
 */
function getJsonType(data) {
    let dataType = typeof data;
    if (dataType === 'object' && Array.isArray(data)) {
        return 'array';
    } else {
        return dataType
    }
}



/**
 * 判断字段是否为某一字段数组的子字段
 */
exports.isSubItem = function isSubItem(subItem,items) {
    //参见 https://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string#answer-4579228
   return  items.some(ele => new RegExp('^'+ele+'\\b').test(subItem))
}

/**
 * 按照字典排序对象
 */
exports.sortObject = function sortObject(obj) {
    let keys = Object.keys(obj);
    let sortObj = {};
    keys.sort().forEach(key => {
        sortObj[key] = obj[key]
    })
    return sortObj;
}