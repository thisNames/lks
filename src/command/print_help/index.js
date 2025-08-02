/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../class/LoggerSaver");
const MainRunningMeta = require("../../class/MainRunningMeta");
const Params = require("../../class/Params");

/**
 *  打印描述
 *  @param {MainRunningMeta} meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printDescriptions(meta, Logger)
{
    // 参数命令
    Logger.info("参数命令")
    for (let [mapKey, params] of meta.paramsMap.entries())
    {
        Logger.info(`  ${mapKey || ""}  ${params.key}`);
        Logger.info(`  \t${params.description}`);
    }

    // 布尔命令
    Logger.info("布尔命令");
    for (let key in meta.singleMap)
    {
        let single = meta.singleMap[key];
        Logger.info(`  ${single.key}`);
        Logger.info(`  \t${single.description}`);
    }

    // 仓库
    const package = require("../../../package.json");
    Logger.info("获取更多");
    package.repositorys.forEach(item => Logger.info(`  ${item.url}（${item.type}）`));
}

/**
 *  打印版主文档
 *  @param {String} helpDocumentPath 帮助文档路径
 *  @param {String} key 命令
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printHelpDocument(key, helpDocumentPath, Logger)
{
    if (fs.existsSync(helpDocumentPath) && fs.statSync(helpDocumentPath).isFile())
    {
        try
        {
            let data = fs.readFileSync(helpDocumentPath, "utf-8");
            Logger.info(data);
        } catch (error)
        {
            Logger.error(error.message);
        }
    }
    else
    {
        Logger.info("?_?");
        Logger.warn(`此命令 [${key}] 没有找到帮助描述文件`);
    }

    Logger.info("====================");
}

/**
 *  打印参数命令对象模板
 *  @param {MainRunningMeta} meta meta
 *  @param {Array<String>} params 参数列表
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {Boolean}
 */
function printParamsExamples(meta, params, Logger)
{
    let print = false;
    // 参数命令模板
    params.forEach(param =>
    {
        if (param == meta.singleMap.dvp.key) return;

        let pm = meta.paramsMap.get(param) || meta.paramsKeyMap.get(param);

        if (!pm) return Logger.warn(`没有找到对应的命令 [${param}]`);

        let helpDocumentPath = pt.join(pt.dirname(pm.modulePath), pm.example + "");

        let counter = pm.count < 0 ? "不定长参数" : pm.count;
        let defaulter = pm.count < 0 ? "无" : `[${pm.defaults.join(", ")}]`;

        Logger
            .prompt(`${param}: ${pm.description} [参数命令]`)
            .line()
            .success(`参数个数：${counter}`)
            .success(`默认参数：${defaulter}`)
            .line();

        printHelpDocument(param, helpDocumentPath, Logger);

        print = true;
    });

    return print;
}

/**
 *  打印参数命令对象模板
 *  @param {MainRunningMeta} meta meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {Boolean}
 */
function printSingleExamples(meta, Logger)
{
    let print = false;
    for (const key in meta.singleMap)
    {
        if (!Object.prototype.hasOwnProperty.call(meta.singleMap, key)) continue;
        const single = meta.singleMap[key];
        let helpDocumentPath = pt.join(pt.dirname(single.modulePath), single.example + "");
        if (!single.include) continue;

        Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
        printHelpDocument(single.key, helpDocumentPath, Logger);
        print = true;
    }

    return print;
}

/**
 *  @param {Array<String>} params 参数数组
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前运行的参数命令对象
 */
module.exports = function (params, meta, __this)
{
    let print = false;
    const Logger = new LoggerSaver("Print_Help_Task", meta.cwd, meta.singleMap.isSaveLog.include);

    print = printParamsExamples(meta, [...new Set(params)], Logger);
    print = printSingleExamples(meta, Logger);

    if (params.length < 1 && !print) printDescriptions(meta, Logger);

    Logger.close();
}
