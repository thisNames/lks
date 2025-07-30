//#region 外置模块
const pt = require("node:path");
const fs = require("node:fs");

// single-bar-lib.js
const { SingleBar } = require("cli-progress");

const LoggerSaver = require("../../class/LoggerSaver");
const Download = require("../../class/net/Download");
const WorkshopFile = require("../../class/WorkshopFile");
const Loading = require("../../class/Loading");
const Tools = require("../../class/Tools");

const useSteamApiSearch = require("./steam_api");
const REQUEST_HEADERS = require("./headers.js");

//#endregion

/**
 *  开始下载
 *  @param {WorkshopFile} workshopFile workshopFile
 *  @param {String} workerFolder 保存的路径
 *  @returns {Promise<String>}
 */
async function downloading(workshopFile, workerFolder)
{
    // 规范化目录名称
    let title = Tools.sanitizeFolderName(workshopFile.title, workshopFile.id);
    // 新建的目录
    let folder = pt.join(workerFolder, title);
    // 文件名称
    let filename = workshopFile.id + pt.extname(workshopFile.filename);

    //#region 处理路径路径
    let isPathExist = fs.existsSync(folder); // false

    if (isPathExist && fs.statSync(folder).isFile()) return Promise.reject(`ERROR: 此路径已存在，无法覆盖 => ${folder}`);

    !isPathExist && fs.mkdirSync(folder);
    //#endregion

    //#region 下载行为
    // 创建一个下载器
    const download = new Download(new URL(workshopFile.file_url), folder, filename, REQUEST_HEADERS);

    // 初始化大小
    const initSize = Tools.formatBytes(workshopFile.file_size);

    // 创建一个单进度条
    const barComplete = "完成";
    const barIncomplete = "下载中";
    const bar = new SingleBar({
        format: `{complete} {percentage}% {bar} {current}/${initSize.value}${initSize.type}`,
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true
    });

    // 创建一个加载条
    const loading = new Loading().start("加载中...");

    // 监听下载事件【加载成功】
    download.listener(Download.EventTypeStartDownload, () =>
    {
        // 渲染进度条
        loading.stop(true, "加载成功");
        bar.start(workshopFile.file_size, 0);
    });

    // 【实时进度】
    download.listener(Download.EventTypeProgress, (current, total) =>
    {
        let size = Tools.formatBytes(current);
        bar.update(current, { current: size.value + size.type, complete: current >= total ? barComplete : barIncomplete });
    });

    // 开始下载
    const response = await download.start("", 60000).catch(error => ({ error }));

    // 下载失败
    if (response.error || response.code != 200)
    {
        bar.stop();
        loading.stop(false, "加载失败");

        return Promise.reject(`ERROR: 下载失败 => ${response.error}`);
    }

    // 下载成功
    bar.stop();
    //#endregion

    //#region 生成 meta.json
    try
    {
        fs.writeFileSync(pt.join(folder, "meta.json"), JSON.stringify(workshopFile), { encoding: "utf-8", flag: "w" });
    } catch (error)
    {
        return Promise.reject(`ERROR: 写入 meta.json 失败 => ${error.message}`);
    }
    //#endregion

    return Promise.resolve(`下载成功，保存至 => ${response.data.savePath}`);
}

/**
 *  打印一个 WorkshopFile 详细
 *  @param {Number} index 索引
 *  @param {WorkshopFile} workshopFile workshopFile
 *  @param {LoggerSaver} Logger logger
 */
function printWorkshopFileDetail(index, workshopFile, Logger)
{
    Logger.line().warn(index).success(workshopFile.title.trim()).prompt(`[ID: ${workshopFile.id}] [Size: ${workshopFile.size}]`);
}

/**
 *  验证参数，必须数字字符串
 *  @param {Array<String>} params 参数集合
 *  @param {LoggerSaver} Logger 日志记录器
 *  @return {Array<String>} ids 集合
 */
function ivalParams(params, Logger)
{
    const ids = new Set();
    const idReg = /^\d+$/;

    if (params.length < 1)
    {
        Logger.error("ERROR: 必须至少有一个参数 id/url");
        return [];
    }

    for (let i = 0; i < params.length; i++)
    {
        let id = params[i];
        let origin = Tools.validURL(id);

        id = origin ? origin.searchParams.get("id") : id;

        if (ids.has(id)) continue
        if (!idReg.test(id))
        {
            Logger.error(`ERROR: 第${i + 1}个参数的 id 不合法，请重新输入`);
            return [];
        }

        ids.add(id);
    }

    return [...ids];
}

/**
 *  下载 Steam 创意工坊的文件（免费的）
 *  @param {Array<String>} params 参数数组
 *  @param {Object} meta 附加数据对象
 */
async function main(params, meta, __this)
{
    // 获取单例映射
    const { singleMap, cwd } = meta;
    const workerFolder = cwd || process.cwd();
    let isSaveLog = singleMap.isSaveLog.include;

    // 日志
    const Logger = new LoggerSaver("DownloadVPK", pt.resolve("./"), isSaveLog);

    const ids = ivalParams(params, Logger);
    if (ids.length < 1) return;

    //#region Steam API 获取结果
    // 显示加载中
    const load = new Loading().start("搜索中...🔍");

    /** @type {Array<WorkshopFile>} */
    const workshopFiles = await useSteamApiSearch(ids, REQUEST_HEADERS).catch(error => ({ error }));

    // 搜索失败
    if (workshopFiles.error || !Array.isArray(workshopFiles))
    {
        load.stop(false, "搜索失败");
        return Logger.error(`ERROR: ${workshopFiles.error || "未知错误"}`);
    }

    // 结果为空
    if (workshopFiles.length < 1) return load.stop(false, "结果为空");

    // 搜索成功
    load.stop(true, "搜索成功");
    //#endregion

    //#region 显示结果
    workshopFiles.forEach((workshopFile, index) => printWorkshopFileDetail(index + 1, workshopFile, Logger));

    // 询问监听终端输入
    Logger.line().info("确认下载 [yes/y][on]");

    const terminal = await Tools.terminalInput().catch(m => m);

    if (!(terminal == "yes" || terminal == "y")) return Logger.warn("取消下载");
    //#endregion

    //#region 开始下载
    for (let i = 0; i < workshopFiles.length; i++)
    {
        const workshopFile = workshopFiles[i];

        printWorkshopFileDetail(i + 1, workshopFile, Logger);
        await downloading(workshopFile, workerFolder).then(s => Logger.line().success(s)).catch(r => Logger.line().error(r));
    }
    //#endregion

    Logger.close();
}

module.exports = main;
