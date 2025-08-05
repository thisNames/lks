const ResponseData = require("../../../class/net/ResponseData");
const HttpRequest = require("../../../class/net/HttpRequest");

/**
 *  使用 Steam API 搜索
 *  @param {URL} origin URL 对象
 *  @param {String} method 请求方式
 *  @param {Object} headers 请求头
 *  @param {String} body 请求体
 *  @param {Number} timeout 超时时间
 *  @returns {Promise<ResponseData>} 成功返回响应对象 | 错误信息
 *  @throws 直接请求失败
 *  @throws 获取响应对象数据时失败
 *  @throws json 解析失败
 */
async function requestAPI(origin, method, headers, body, timeout)
{
    const ERROR_DATE = new Date();
    const ERROR_TIME = ERROR_DATE.getTime();
    const ERROR_TIME_STRING = ERROR_DATE.toLocaleTimeString("zh-CN");

    // 创建请求器
    const requester = new HttpRequest(origin, method, headers);

    // 获取响应对象 | error
    const incomingMessage = await requester.request(body, timeout).catch(error => ({ [ERROR_TIME]: error }));

    // 请求失败
    let error = incomingMessage[ERROR_TIME];
    if (error) return Promise.reject(`[${ERROR_TIME_STRING}] ${error}`);

    // 设置响应体类型
    incomingMessage.setEncoding("utf-8");

    // 等待响应体数据
    const responseData = await new Promise((res, rej) =>
    {
        let responseBody = "";
        incomingMessage.on("data", chunk => responseBody += chunk);
        incomingMessage.on("end", () => res(responseBody));
        incomingMessage.on("error", () => rej(null));
        incomingMessage.on("close", () => rej(null));
    }).catch(error => error);

    // 响应体数据读取失败
    if (!responseData) return Promise.reject(`[${ERROR_TIME_STRING}] Try reading response data error`);

    // 解析数据
    const rData = new ResponseData(incomingMessage.statusCode);

    try
    {
        rData.data = JSON.parse(responseData);
        rData.message = "json";
    } catch (error)
    {
        // 解析失败
        return Promise.reject(responseData);
    }

    return Promise.resolve(rData);
}

module.exports = requestAPI;
