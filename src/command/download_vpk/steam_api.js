const querystring = require("node:querystring");

const WorkshopFile = require("../../class/WorkshopFile");
const HttpRequest = require("../../class/net/HttpRequest");
const ResponseData = require("../../class/net/ResponseData");
const Tools = require("../../class/Tools");

const requestAPI = require("./lib/request");
const CONFIG = require("./lib/config");
const TIMEOUT = 60000;

/**
 *  填充查询集合接口数据
 *  @param {Array<String>} ids id 数组
 *  @returns {String}
 */
function fillCollectionFormData(ids)
{
    const collectioncount = ids.length;
    const form = { collectioncount };

    ids.forEach((id, index) => Reflect.set(form, `publishedfileids[${index}]`, id));

    return querystring.stringify(form);
}

/**
 *  填充查询文件接口数据
 *  @param {Array<String>} ids id 数组
 *  @returns {String}
 */
function fillPublishedFileFormData(ids)
{
    const itemcount = ids.length;
    const form = { itemcount };

    ids.forEach((id, index) => Reflect.set(form, `publishedfileids[${index}]`, id));

    return querystring.stringify(form);
}

/**
 *  使用 Steam API 搜索集合内容
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<Array<String>>} 文件 id 数组
 *  @throws 请求失败
 *  @throws API 数据解析失败
 */
async function requestCollectionDetails(ids)
{
    const idCollection = [];

    let body = fillCollectionFormData(ids);
    let origin = new URL(CONFIG.steam.base + CONFIG.steam.api.GetCollectionDetails.uri);
    // let origin = new URL(CONFIG.test.base + CONFIG.test.api.GetCollectionDetails.uri);

    const response = await requestAPI(origin, "POST", CONFIG.steam.headers, body, TIMEOUT).catch(error => ({ error }));

    if (response.error || response.message != "json" || response.code != 200) return Promise.reject(`requestCollectionDetails => ${response.error || "Unknown request error"}`); // 404

    // 尝试获取数据
    const collection = response.data.response?.collectiondetails;
    if (!Array.isArray(collection)) return Promise.reject(`requestCollectionDetails => Invalid API data`);

    for (let i = 0; i < collection.length; i++)
    {
        const element = collection[i];
        const children = element?.children;

        if (Array.isArray(children) && element.result == 1)
        {
            // 是一个集合
            for (let j = 0; j < children.length; j++)
            {
                const child = children[j];

                if (child.filetype != 0) continue;
                idCollection.push(child.publishedfileid);
            }
            continue;
        }

        // 是一个文件
        if (element.result != 9) continue;
        idCollection.push(element.publishedfileid);
    }

    return Promise.resolve(idCollection);
}

/**
 *  使用 Steam API 搜索文件内容
 *  @param {Array<String>} ids id 数组
 *  @returns {Promise<Array<WorkshopFile>>} WorkshopFile 文件对象
 *  @throws 集合请求失败
 *  @throws 空集合
 *  @throws 文件请求失败
 *  @throws API 数据解析失败
 */
async function requestPublishedFileDetails(ids)
{
    /** @type {Array<WorkshopFile>} 文件集合 */
    const workshopFiles = [];

    let origin = new URL(CONFIG.steam.base + CONFIG.steam.api.GetPublishedFileDetails.uri);
    // let origin = new URL(CONFIG.test.base + CONFIG.test.api.GetPublishedFileDetails.uri);

    const idCollection = await requestCollectionDetails(ids).catch(error => ({ error }));

    if (idCollection.error) return Promise.reject(`requestPublishedFileDetails => ${idCollection.error}`);
    if (idCollection.length < 1) return Promise.reject("requestPublishedFileDetails => Empty");

    let body = fillPublishedFileFormData(idCollection);

    // 开始请求
    const response = await requestAPI(origin, "POST", CONFIG.steam.headers, body, TIMEOUT).catch(error => ({ error }));

    if (response.error || response.message != "json" || response.code != 200) return Promise.reject(`requestPublishedFileDetails => ${response.error || "Unknown request error"}`);

    // 尝试读取数据
    const details = response.data?.response?.publishedfiledetails;
    if (!Array.isArray(details)) return Promise.reject("requestPublishedFileDetails => Invalid API data");

    for (let i = 0; i < details.length; i++)
    {
        const element = details[i];

        if (element.result != 1 || typeof element != "object") continue;

        const workshopFile = WorkshopFile.createWorkshopFileProxy();

        try
        {
            workshopFile.index = i;
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
