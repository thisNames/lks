const querystring = require("node:querystring");

const WorkshopFile = require("../../class/WorkshopFile");
const HttpRequest = require("../../class/net/HttpRequest");
const ResponseData = require("../../class/net/ResponseData");
const Tools = require("../../class/Tools");

const REQUEST_API = require("./api");

/**
 *  使用 Steam API 搜索
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<ResponseData>}
 */
async function search(ids, requestHeaders)
{
    // 创建请求器
    const requester = new HttpRequest(new URL(REQUEST_API.Steam_GetPublishedFileDetails_API), "POST", requestHeaders);

    // itemcount=1&publishedfileids[0]=id 填充参数
    const form = { itemcount: ids.length };
    ids.forEach((id, index) => Reflect.set(form, `publishedfileids[${index}]`, id));
    const requestBody = querystring.stringify(form);

    // 获取响应对象 | error
    const incomingMessage = await requester.request(requestBody, 60000).catch(error => ({ error }));

    // 请求失败
    if (incomingMessage.error) return Promise.reject(incomingMessage.error);

    // 设置响应体类型
    incomingMessage.setEncoding("utf-8");

    // 等待响应体数据
    const responseData = await new Promise((res, rej) =>
    {
        let responseBody = "";
        incomingMessage.on("data", chunk => responseBody += chunk);
        incomingMessage.on("end", () => res(responseBody));
        incomingMessage.on("error", () => rej(""));

    }).catch(error => error);

    // 响应体数据读取失败
    if (!responseData) return Promise.reject("try reading response data error");

    // 解析数据
    const rData = new ResponseData(incomingMessage.statusCode);

    try
    {
        rData.data = JSON.parse(responseData);
        rData.message = "OK";
    } catch (error)
    {
        // 解析失败
        return Promise.reject(responseData);
    }

    return rData;
}

/**
 *  搜索 Mod
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<Array<WorkshopFile>>} 一个 Mod 对象
 */
module.exports = async function (ids, requestHeaders)
{
    /** @type {Array<WorkshopFile>} 工坊文件集合 */
    const workshopFiles = [];

    // 搜索文件详情
    const response = await search(ids, requestHeaders).catch(error => ({ error }));

    // 搜索失败 | 404
    if (response.error || response.code != 200) return Promise.reject(`Search => ${response.error || "404 Not Found"}`);

    //#region 尝试读取数据
    const details = response.data?.response?.publishedfiledetails;

    if (!Array.isArray(details)) return Promise.reject("Invalid API response format");

    for (let i = 0; i < details.length; i++)
    {
        const element = details[i];

        if (element.result != 1 || typeof element != "object") continue;

        const workshopFile = WorkshopFile.createWorkshopFileProxy();

        try
        {
            workshopFile.id = element.publishedfileid;
            workshopFile.title = element.title;
            workshopFile.filename = element.filename;
            workshopFile.file_url = element.file_url;
            workshopFile.file_size = Number.parseInt(element.file_size);

        } catch (error)
        {
            continue;
        }

        // 计算文件大小
        let size = Tools.formatBytes(workshopFile.file_size);
        workshopFile.size = size.value + size.type;

        workshopFiles.push(workshopFile);
    }
    //#endregion

    return Promise.resolve(workshopFiles);
}
