const https = require("node:https");
const http = require("node:http");

/**
 *  https, http 网络请求类
 */
class HttpsRequested
{
    /** @type {String} 支持的协议 */
    static Protocols = { "http:": http, "https:": https }

    /**
    *  @param {URL} origin url object
    *  @param {String} method 请求方法
    *  @param {Object} headers 请求头对象
    */
    constructor(origin, method, headers)
    {
        this.origin = origin;
        this.method = method;
        this.headers = headers;

        /** @type {Map<String, Function>} 事件 */
        this.events = new Map();

        /** @type {https | http | undefined} 事件 */
        this.__https = HttpsRequested.Protocols[this.origin.protocol];
    }


    /**
    *  开始发送
    *  @param {String} body 请求体
    *  @param {Number} [timeout=10000] 请求超时时间，单位毫秒（默认 60000）
    *  @returns {Promise<http.IncomingMessage>}
    */
    request(body, timeout = 60000)
    {
        return new Promise((res, rej) =>
        {
            // 检测协议
            if (!this.__https) return rej(`request unsupported protocols: ${this.origin.protocol}`);

            // 请求配置
            const option = {
                method: this.method,
                headers: this.headers,
                timeout: timeout,
                rejectUnauthorized: false
            };

            // 创建请求对象
            const request = this.__https.request(this.origin, option, response => res(response));

            // 请求对象事件监听
            request.on("timeout", () =>
            {
                let err = "request timeout";
                rej(err);// 失败
                request.destroy(new Error(err));
            });
            request.on("error", err => rej(`request error: ${err.message}`));// 失败

            request.write(body, "utf-8");
            request.end()
        });
    }

    /**
     *  触发事件
     *  @param {Number} type 事件类型
     *  @param {...*} argv 参数
     *  @returns {Download} this
     */
    __emit(type, ...argv)
    {
        const cb = this.events.get(type);
        cb && cb(...argv);
        return this;
    }

    /**
     *  监听事件（会覆盖）
     *  @param {String} type 事件类型 ==> Download.EventType
     *  @param {Function} callback 回调
     *  @returns {Download} this
     */
    listener(type, callback)
    {
        this.events.set(type, callback);
        return this;
    }
}


module.exports = HttpsRequested;
