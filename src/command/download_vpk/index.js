//#region 外置模块
const pt = require("node:path");
const fs = require("node:fs");

const { SingleBar } = require("cli-progress");

const LoggerSaver = require("../../class/LoggerSaver");
const Download = require("../../class/net/Download");
const WorkshopFile = require("../../class/WorkshopFile");
const Loading = require("../../class/Loading");
const Tools = require("../../class/Tools");
const FormatNumber = require("../../class/FormatNumber");

const steamSearch = require("./steam_api");
const SteamIOSearch = require("./steam_io_api");
const STYLE = require("./lib/style");
const OPTION = require("./lib/option");

/**
 *  创建 meta.json 文件
 *  @param {WorkshopFile} workshopFile workshopFile
 *  @returns {void}
 */
function createMetaFile(workshopFile)
{
    try
    {
        fs.writeFile(pt.join(workshopFile.folder + "", "meta.json"), JSON.stringify(workshopFile), { encoding: "utf-8", flag: "w" }, error => error);
    } catch (error)
    {

    }
}

/**
 *  开始下载
 *  @param {WorkshopFile} workshopFile workshopFile
 *  @param {String} workerFolder 保存的目录
 *  @returns {Promise<String>} 成功 | 失败的信息
 *  @throws 路径被占用错误
 *  @throws 文件地址错误
 *  @throws 下载失败
 */
async function downloading(workshopFile, workerFolder)
{
    // 规范化目录名称
    let title = workshopFile.title;
    // 新建的目录
    let folder = pt.join(workerFolder, title);
    // 文件名称
    let filename = workshopFile.id + pt.extname(workshopFile.filename) || ".vpk";

    // 处理路径路径
    let isPathExist = fs.existsSync(folder); // false
    if (isPathExist && fs.statSync(folder).isFile()) return Promise.reject(`ERROR: 此路径已存在，无法覆盖 => ${folder}`);
    !isPathExist && fs.mkdirSync(folder);

    // 验证资源路径
    let origin = Tools.validURL(workshopFile.file_url);
    if (!origin) return Promise.reject(`ERROR: 资源链接不存在 => ${title}`);

    //#region 下载行为
    // 当前进度字节
    let currentBytes = 0;
    // 创建一个下载器
    const download = new Download(origin, folder, filename, { "Connection": "keep-alive" });
    // 创建一个 FormatNumber，格式化输出数值
    const fn = new FormatNumber(0, 1000, ["ms", "s", "min", "hours"]);
    // 开始时间
    const startTime = Date.now();
    // 初始化大小
    const initSize = fn.formatBytes(workshopFile.file_size);
    // 单进度条数据对象
    const singleBarPayload = {
        current: "0B",
        complete: "进度",
        time: 0,
        speed: 0
    };
    // 创建一个单进度条对象
    const bar = new SingleBar({
        ...STYLE.singleBarStyle,
        format: `{complete} {percentage}% {bar} {current}/${initSize.value}${initSize.type} {time} {speed}/s`,
    });
    // 创建一个加载条
    const loading = new Loading().start("加载中...");

    // 监听下载事件
    // 【加载成功】
    download.listener(Download.EventTypeStartDownload, () =>
    {
        // 渲染进度条 => 下载中
        singleBarPayload.complete = STYLE.barStyle.incomplete;

        loading.stop(true, "加载成功");
        bar.start(workshopFile.file_size, 0, singleBarPayload);
    });
    // 【实时进度】
    download.listener(Download.EventTypeProgress, (bCurrent, bTotal, bSpeed) =>
    {
        let size = fn.formatBytes(bCurrent);
        let time = fn.formatNumber(Date.now() - startTime);
        let speed = fn.formatBytes(bSpeed);

        singleBarPayload.current = size.value + size.type;
        singleBarPayload.time = time.value + time.type;
        singleBarPayload.speed = speed.value + speed.type;

        currentBytes = bCurrent;

        bar.update(currentBytes, singleBarPayload);
    });

    // 开始下载
    const response = await download.start("", OPTION.option.timeout).catch(error => ({ error }));

    // 下载失败
    if (response.error || response.code != 200)
    {
        singleBarPayload.complete = STYLE.barStyle.error;

        bar.update(currentBytes, singleBarPayload);
        bar.stop();
        loading.stop(false, "加载失败(T_T)");

        return Promise.reject(`ERROR: 下载失败 => ${response.error}`);
    }

    /// 下载成功
    singleBarPayload.complete = STYLE.barStyle.complete;
    singleBarPayload.speed = 0;

    bar.update(workshopFile.file_size, singleBarPayload);
    bar.stop();
    //#endregion

    // 添加备注信息
    let time = fn.formatNumber(Date.now() - startTime);

    workshopFile.remark = `Time: ${time.value + time.type}`;
    workshopFile.folder = folder;

    return Promise.resolve(`下载成功，保存至 => ${response.data.savePath}`);
}

/**
 *  打印一组 WorkshopFile 详细
 *  @param {Number} index 索引
 *  @param {Array<WorkshopFile>} workshopFiles 文件集合 workshopFile[]
 *  @param {LoggerSaver} Logger logger
 */
function printWorkshopFileDetails(workshopFiles, Logger)
{
    Logger.line();

    for (let i = 0; i < workshopFiles.length; i++)
    {
        const workshopFile = workshopFiles[i];

        Logger.warn(`index: ${workshopFile.index + 1}`);
        Logger.success(workshopFile.title.trim());
        Logger.prompt(`[ID: ${workshopFile.id}] [Size: ${workshopFile.size}]`);
    }

    Logger.line();
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
 *  @returns {Promise<void>}
 */
async function main(params, meta, __this)
{
    const { singleMap, cwd } = meta;
    const workerFolder = cwd || process.cwd();
    const isSaveLog = singleMap.isSaveLog.include;

    const Logger = new LoggerSaver("DownloadVPK_Task", workerFolder, isSaveLog);
    const ids = ivalParams(params, Logger);
    if (ids.length < 1) return;

    // 开始搜索
    const api = OPTION.option.toggle.steamio ? "steamio" : "steam";
    const load = new Loading().start(`[${api}]🔍...`);

    /** @type {Array<WorkshopFile>} 文件集合 */
    let workshopFiles = [];

    if (OPTION.option.toggle.steamio)
    {
        workshopFiles = await SteamIOSearch(ids).catch(error => ({ error }));
    }
    else
    {
        workshopFiles = await steamSearch(ids).catch(error => ({ error }));
    }

    if (workshopFiles.error)
    {
        load.stop(false, "搜索失败");
        return Logger.error(`ERROR: ${workshopFiles.error || "Unknown search error"}`);
    }
    load.stop(true, "搜索成功");

    // 显示结果
    printWorkshopFileDetails(workshopFiles, Logger);

    // 询问监听终端输入
    Logger.line().info("确认下载 [yes/y][no]");

    const terminal = await Tools.terminalInput().catch(m => m);
    if (!(terminal == "yes" || terminal == "y")) return Logger.warn("取消下载");

    // 开始下载
    for (let i = 0; i < workshopFiles.length; i++)
    {
        const workshopFile = workshopFiles[i];

        printWorkshopFileDetails([workshopFile], Logger);
        await downloading(workshopFile, workerFolder).then(s =>
        {
            Logger.line().success(s);
            createMetaFile(workshopFile);
        }
        ).catch(r =>
        {
            Logger.line().error(r);
        });
    }

    Logger.close();
}

module.exports = main;
