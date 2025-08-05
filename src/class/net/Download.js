const http = require("node:http");

const fs = require("node:fs");
const pt = require("node:path");

const HttpRequest = require("./HttpRequest");
const ResponseData = require("./ResponseData");

/**
 *  公共资源下载器，支持的协议：https, http
 *  @version 0.0.2
 */
class Download extends HttpRequest
{
    /** 
     * 下载实时进度事件
     * @type {String}
     * @event progress (当前的字节数，总的字节数，当前速度字节/秒)
     */
    static EventTypeProgress = "progress";

    /** 
     * 开始下载事件
     * @type {String}
     * @event start 无
     */
    static EventTypeStartDownload = "start";

    /**
     *  @param {URL} origin URL Object
     *  @param {String} folder 保存目录
     *  @param {String} filename 文件名称
     *  @param {Object} headers 请求头
     */
    constructor(origin, folder, filename, headers = {})
    {
        super(origin, "GET", headers);

        this.folder = folder;
        this.filename = filename;

        // 网速更新的速度，默认 1000ms
        this.__netUpdateSpeed = 1000;
    }

    /**
     *  下载文件
     *  @param {http.IncomingMessage} response 响应对象
     *  @param {Function} res 成功的 Promise 回调
     *  @param {Function} rej 失败的 Promise 回调
     */
    __downloadFile(response, res, rej)
    {
        // 设置数据格式：二进制
        response.setEncoding("binary");

        // 进度条
        let __contentLength = Number.parseInt(response.headers["content-length"]);
        let contentLength = Number.isNaN(__contentLength) ? 0 : __contentLength;
        let currentLength = 0;

        // 下载速度计算
        let lastTime = Date.now();
        let lastBytes = 0;
        let speedBytes = 0;

        // 创建写入流对象
        let filePath = pt.join(this.folder, this.filename);
        const ws = fs.createWriteStream(filePath, { flags: "w", encoding: "binary" });

        // 写入流事件监听
        ws.on("error", err =>
        {
            let msg = `write error: ${err.message}`;

            rej(msg);// 失败
            response.destroy(new Error(msg));// 销毁响应
        });

        // 响应对象事件监听
        response.on("data", chunk =>
        {
            ws.write(chunk);

            // 实时进度
            currentLength += Buffer.byteLength(chunk, "binary");

            // 实时速度
            let now = Date.now();
            let elapsedTime = now - lastTime;
            let elapsedTBytes = currentLength - lastBytes;

            if (elapsedTime > this.__netUpdateSpeed)
            {
                speedBytes = elapsedTBytes / elapsedTime * this.__netUpdateSpeed;
                lastTime = now;
                lastBytes = currentLength;
            }


            this.__emit(Download.EventTypeProgress, currentLength, contentLength, speedBytes);

        });
        response.on("end", () =>
        {
            // 响应对象
            const rData = new ResponseData(response.statusCode);

            rData.message = "OK";
            rData.data = { currentByte: currentLength, totalByte: contentLength, savePath: filePath };

            res(rData);// 成功
            ws.closed || ws.close();
        });
        response.on("error", err =>
        {
            rej(`response error: ${err.message}`);// 失败
            ws.closed || ws.close();
        });
    }

    /**
     *  开始下载 https
     *  @param {String} body 请求体
     *  @param {Number} [timeout=10000] 请求超时时间，单位毫秒（默认 30000）
     *  @returns {Promise<ResponseData>}
     */
    async start(body = "", timeout = 30000)
    {
        try
        {
            const response = await this.request(body, timeout);

            this.__emit(Download.EventTypeStartDownload);

            return new Promise((res, rej) => this.__downloadFile.bind(this)(response, res, rej));
        } catch (error)
        {
            return Promise.reject(error);
        }
    }
}

module.exports = Download;
