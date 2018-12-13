/**
 * 检查是否为空对象
 * @param  {object} obj 输入对象
 */
exports.isEmptyObj = function isEmptyObj(obj) {

    //排出原始类型和null,暂不考虑原始封装类型
    if(obj === null  || (typeof obj !== 'object') ) {
        return true;
    }

    return Object.keys(obj).length === 0;
}

/**
 * 检查对象是否包含某个 key
 * @param  {array} keys 键名数组
 * @param  {object} obj 输入对象
 */
exports.isObjectHasKeys = function isObjectHasKeys(keys,obj) {
    if(obj === null || (typeof obj !== 'object')) {
        return false;
    }

    return keys.every((key) => {
        return (key in obj)
    })
}