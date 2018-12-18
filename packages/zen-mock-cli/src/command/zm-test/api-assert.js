/**
 * api 断言类,断言两个 api 结果是否相同.
 * 
 * 
 */
const {flattenObjToJsonType,isSubItem,sortObject} = require('../../utils');
const  AssertError = require('assertion-error');
const deepmerge = require('deepmerge');

module.exports = {
    messaage(item) {
        return item.message || 
        `${item.name}`
    },
    apiDiff,
    apiEqual(expectResp,realResp,message = 'api data error') {
        let result = apiDiff(expectResp,realResp);

        let keys = Object.keys(result);

        if(keys.some(key => result[key].length)) { //返回有结果说明出现错误
            result  = deepmerge(result,{
                showDiff:true
            })
            throw new AssertError(message,result);
        }
        return true; 
    }
}

/**
 * diff 实际接收请求体和实际请求体区别
 * @param {Object} expectResp 期望返回结果
 * @param {Object} realResp 实际返回结果
 * 
 */
function apiDiff(expectResp,realResp) {
    //TODO:后续可采用函数式编程

    let flatExpectResp = sortObject(flattenObjToJsonType({
        respond:expectResp //注意此处在响应外层包裹 respond 来代表响应的实体数据
    }));
    let flatRealResp = sortObject(flattenObjToJsonType({
        respond:realResp
    }));

    let keys = Object.keys(flatExpectResp);

    let missingItems = [],//存储缺失字段
        invalidItems =[],//存储类型错误字段
        redundantItems =[],//冗余字段
        errorItems = [];//该字段避免对一致为错误的字段进行深度检查,例如 {a:{b:1}} 假设 a 实际值不为对象,则检查 a.b 无意义,因为已报 a 的类型错误



    keys.forEach((key) => {
        if(isSubItem(key,errorItems)) { //如果字段对应的父字段为错误,则无需检查
            return;
        }

        //注意未定义和值为空是不一样的!!!!!
        if(flatRealResp.hasOwnProperty(key)) {
             let expectType = flatExpectResp[key],realType = flatRealResp[key];
             if(expectType !== realType) { //说明类型不相同
                invalidItems.push({
                    item:key,
                    expect:expectType,
                    real:realType
                    })
                    errorItems.push(key);//压入错误字段
             }
                  
        } else { //该字段不存在
            missingItems.push(key);
            errorItems.push(key);//压入错误字段
        }
    })

    return {
        missingItems,
        invalidItems,
        redundantItems
    };
}

