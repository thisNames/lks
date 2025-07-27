const pt = require("node:path");
const fs = require("node:fs");

// single-bar-lib.js
const { SingleBar } = require("cli-progress");

const Logger = require("../../class/Logger");
const Download = require("../../class/net/Download");
const WorkshopFile = require("../../class/WorkshopFile");
const Loading = require("../../class/Loading");

// tools
const { terminalInput, sanitizeFolderName, formatBytes, validURL } = require("../../class/Tools");

const useSteamApiSearch = require("./steam_api");
const REQUEST_HEADERS = require("./headers");

/**
 *  开始下载
 *  @param {WorkshopFile} workshopFile workshopFile
 */
function downloading(workshopFile)
{
    // 保存的目录
    let workerFolder = pt.resolve("./");
    // 检测名称
    let title = sanitizeFolderName(workshopFile.title, workshopFile.id);
    // 新建的目录
    let folder = pt.join(workerFolder, title);
    // 文件名称
    let filename = workshopFile.id + pt.extname(workshopFile.filename);

    // 处理路径
    if (!fs.existsSync(folder))
    {
        fs.mkdirSync(folder);
    }
    else if (fs.statSync(folder).isFile())
    {
        folder = folder + "_" + Date.now();
    }

    // 创建一个下载器
    const download = new Download(new URL(workshopFile.file_url), folder, filename, REQUEST_HEADERS);

    // 初始化大小
    const initSize = formatBytes(workshopFile.file_size);

    // 创建一个单进度条
    const bar = new SingleBar({
        format: `下载中 {percentage}% {bar} {current}/${initSize.value}${initSize.type}`,
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true
    });

    // 开始下载
    download.listener(Download.EventTypeStartDownload, () =>
    {
        // 渲染进度条
        Logger.success("加载成功");
        bar.start(workshopFile.file_size, 0);
    });

    // 实时进度
    download.listener(Download.EventTypeProgress, (current, total) =>
    {
        let size = formatBytes(current);
        bar.update(current, { current: size.value + size.type });
    });

    // 开始下载
    download.start("", 10000).then(res =>
    {
        bar.stop();

        // 生成 meta.json
        fs.writeFile(pt.join(folder, "meta.json"), JSON.stringify(workshopFile), { encoding: "utf-8" }, err => err);

        Logger.line().success(`下载成功，保存至 => ${res.data.savePath}`);
    }).catch(error =>
    {
        bar.stop();

        Logger.line().error(`ERROR: 下载失败 ${error}`);
    });
}

/**
 *  下载 Steam 创意工坊的文件（免费的）
 *  @param {Array<String>} params 参数数组
 *  @param {Object} meta 附加数据对象
 */
async function awake(params, meta)
{
    //#region 参数检测
    const ids = new Set();

    if (params.length < 1 || !params[0]) return Logger.error("ERROR: 必须至少有一个参数 id/url");

    const idReg = /^\d+$/;

    for (let i = 0; i < params.length; i++)
    {
        let id = params[i];
        let origin = validURL(id);

        if (origin) id = origin.searchParams.get("id");

        if (!idReg.test(id)) return Logger.error(`ERROR: 第${i + 1}个参数的 id 不合法，请重新输入`);

        ids.add(id);
    }
    //#endregion

    // 显示加载中
    const load = new Loading().start("搜索中...🔍");

    // Steam API 查询操作
    /** @type {Array<WorkshopFile>} */
    const workshopFiles = await useSteamApiSearch([...ids]).catch(error => ({ error }));

    // 搜索失败
    if (workshopFiles.error)
    {
        load.stop(false, "搜索失败");
        return Logger.error(`ERROR: ${workshopFiles.error}`);
    }

    // 结果为空
    if (workshopFiles.length < 1) return load.stop(false, "结果为空");

    // 搜索成功
    load.stop(true, "搜索成功");

    // 显示
    workshopFiles.forEach((workshopFile, i) => Logger.line().warn(i + 1).success(workshopFile.title.trim()).prompt(`[ID: ${workshopFile.id}] [Size: ${workshopFile.size}]`));

    Logger.line().info("确认下载 [yes/y][on]");
    const terminal = await terminalInput().catch(error => error);

    // 开始下载
    if (terminal.input == "yes" || terminal.input == "y")
    {
        Logger.info("开始下载");
    }
    else
    {
        Logger.warn("取消下载");
    }
}

module.exports = awake;
