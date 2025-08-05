const WorkshopFile = require("../../class/WorkshopFile");

const requestAPI = require("./lib/request");
const parseDetails = require("./lib/parse_details");
const CONFIG = require("./lib/config");
const OPTION = require("./lib/option");

/**
 *  填充查询集合接口数据
 *  @param {Array<String>} ids id 数组
 *  @returns {String}
 */
function fillCollectionFormData(ids)
{
    if (ids.length == 1) return `[${ids[0]}]`;

    let form = "[";

    ids.forEach((id, index) =>
    {
        if (index == ids.length - 1) return form += `${id}`;
        form += `${id},`;
    });

    return form + "]";
}

/**
 *  使用 Steam IO API 搜索文件内容
 *  @param {String} body 请全体
 *  @returns {Promise<Array<WorkshopFile>>} WorkshopFile 文件对象
 *  @throws 请求失败
 *  @throws API 数据解析失败
 */
async function requestPublishedFileDetails(body)
{
    /** @type {Array<WorkshopFile>} 文件集合 */
    let workshopFiles = [];

    let origin = new URL(CONFIG.steamio.base + CONFIG.steamio.api.steamIOQuery.uri);
    // let origin = new URL(CONFIG.test.base + CONFIG.test.api.steamIOQuery.uri);

    // 开始请求
    const response = await requestAPI(origin, "POST", CONFIG.steamio.headers, body, OPTION.option.timeout).catch(error => ({ error }));

    if (response.error || response.message != "json" || response.code != 200) return Promise.reject(`requestPublishedFileDetails => ${response.error || "Unknown request error"}`);

    // 尝试读取数据
    const details = response.data;

    if (!Array.isArray(details)) return Promise.reject("requestPublishedFileDetails => Invalid API data");

    workshopFiles = parseDetails(details);

    return Promise.resolve(workshopFiles);
}

/**
 *  搜索文件（通过 id 搜索）
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<Array<WorkshopFile>>} WorkshopFile 文件对象集合
 *  @throws 请求搜索失败
 *  @throws 空数据
 */
async function search(ids)
{
    const body = fillCollectionFormData(ids);
    const workshopFiles = await requestPublishedFileDetails(body).catch(error => ({ error }));

    if (workshopFiles.error) return Promise.reject(`search => ${workshopFiles.error}`);
    if (!Array.isArray(workshopFiles) || workshopFiles.length < 1) return Promise.reject("search => Empty");

    return Promise.resolve(workshopFiles);
}

module.exports = search;
