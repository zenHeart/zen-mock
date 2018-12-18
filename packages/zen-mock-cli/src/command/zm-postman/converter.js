//转换 zen-mock 配置为 postman 格式
/**
 * 输出 postman collection 格式,详见 https://schema.getpostman.com/collection/json/v2.1.0/draft-07/docs/index.html
 * @param {Object} zenConfig zen-mock api 配置文件
 */
const deepmerge = require('deepmerge');

exports.convertToPostman = function convertToPostman(zenConfig,options={}) {
    let request = {
        url: '',
        method: '',
        header: [],
        body: ''
    };
    let { url, method, body, header } = zenConfig;

    request.url = url;
    request.method = method.toUpperCase();

    let headerKeys = Object.keys(header);
    headerKeys.forEach((key) => {
        request.header.push({
            key: key,
            value: header[key]
        })
    })

    //没有定义内容类型选择 json
    if (!header['Content-type']) {
        request.header.push({
            key: 'Content-type',
            value: "application/json",
        })
    }

    request.body = {
        mode: 'raw',
        raw: JSON.stringify(body)
    }

    return deepmerge({request},options);
}