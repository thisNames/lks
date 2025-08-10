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
 *  使用 Steam IO API 搜索集合内容
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<Array<String | WorkshopFile>>} 文件 id 数组
 *  @throws 请求失败
 *  @throws API 数据解析失败
 */
async function requestCollectionDetails(ids)
{
    /** @type {Array<String>} idsCollection id 集合 */
    let idsCollection = [];
    let body = fillCollectionFormData(ids);

    let origin = new URL(CONFIG.steamio.base + CONFIG.steamio.api.steamIOQuery.uri);
    // let origin = new URL(CONFIG.test.base + CONFIG.test.api.steamIOQuery.uri);

    // 开始请求
    const response = await requestAPI(origin, "POST", CONFIG.steamio.headers, body, OPTION.timeout).catch(error => ({ error }));

    if (response.error || response.message != "json" || response.code != 200) return Promise.reject(`requestCollectionDetails => ${response.error || "Unknown request error"}`);

    // 尝试读取数据
    const details = response.data;

    if (!Array.isArray(details)) return Promise.reject("requestCollectionDetails => Invalid API data");

    // 获取 id
    for (let i = 0; i < details.length; i++)
    {
        const detail = details[i];
        if (typeof detail != "object" || detail.result != 1) continue;

        const children = detail.children;

        if (Array.isArray(children))
        {
            for (let j = 0; j < children.length; j++)
            {
                const item = children[j];
                if (typeof item != "object" || item.file_type != 0) continue;
                item.publishedfileid && idsCollection.push(item.publishedfileid);
            }
            continue;
        }

        const workshopFiles = parseDetails([detail]);
        workshopFiles.length > 0 && idsCollection.push(...workshopFiles);
    }

    return Promise.resolve(idsCollection);
}

/**
 *  使用 Steam IO API 搜索文件内容
 *  @param {Array<String>} ids id 集合
 *  @returns {Promise<Array<WorkshopFile>>} WorkshopFile 文件对象
 *  @throws 集合请求失败
 *  @throws 空集合
 *  @throws 请求失败
 *  @throws API 数据解析失败
 */
async function requestPublishedFileDetails(ids)
{
    /** @type {Array<WorkshopFile>} 文件集合 */
    let workshopFiles = [];
    let idsString = [];

    // 获取 id 集合
    const idsCollection = await requestCollectionDetails(ids).catch(error => ({ error }));
    if (idsCollection.error) return Promise.reject(`requestPublishedFileDetails => ${idsCollection.error}`);
    if (idsCollection.length < 1) return Promise.reject("requestPublishedFileDetails => Empty");

    idsCollection.forEach(item => item instanceof WorkshopFile ? workshopFiles.push(item) : idsString.push(item));
    if (idsString.length < 1) return Promise.resolve(workshopFiles);

    let origin = new URL(CONFIG.steamio.base + CONFIG.steamio.api.steamIOQuery.uri);
    // let origin = new URL(CONFIG.test.base + CONFIG.test.api.steamIOQuery.uri);

    let body = fillCollectionFormData([...new Set(idsString)]);

    // 开始请求
    const response = await requestAPI(origin, "POST", CONFIG.steamio.headers, body, OPTION.timeout).catch(error => ({ error }));

    if (response.error || response.message != "json" || response.code != 200) return Promise.reject(`requestPublishedFileDetails => ${response.error || "Unknown request error"}`);

    // 尝试读取数据
    const details = response.data;

    if (!Array.isArray(details)) return Promise.reject("requestPublishedFileDetails => Invalid API data");

    let results = parseDetails(details);

    results.length > 0 && workshopFiles.push(...results);

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
    const workshopFiles = await requestPublishedFileDetails(ids).catch(error => ({ error }));

    if (workshopFiles.error) return Promise.reject(`search => ${workshopFiles.error}`);
    if (!Array.isArray(workshopFiles) || workshopFiles.length < 1) return Promise.reject("search => Empty");

    return Promise.resolve(workshopFiles);
}

module.exports = search;
