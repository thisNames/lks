/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../class/LoggerSaver");

/**
 *  打印简单描述
 *  @param {Object} PMG 参数命令映射表
 *  @param {Object} SM 布尔命令映射表
 *  @param {LoggerSaver} Logger LoggerSaver 实例
 */
function printDescription(PMG, SM, Logger)
{
    // 参数命令
    Logger.info("参数命令")
    for (let key in PMG)
    {
        let pmgOption = PMG[key];
        let mapKey = pmgOption.mapKey || "";
        let { key: paramKey, description, defaults, count } = pmgOption.params;

        Logger.info(`  ${mapKey}  ${paramKey}`);
        Logger.info(`  \t${description}`);
    }

    // 布尔命令
    Logger.info("布尔命令");
    for (let key in SM)
    {
        let smOption = SM[key];
        let { key: singleKey, description } = smOption;
        Logger.info(`  ${singleKey}`);
        Logger.info(`  \t${description}`);
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
 *  @param {LoggerSaver} Logger LoggerSaver 实例
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
 *  @param {Array<String>} params 参数数组
 *  @param {Object} meta meta
 */
module.exports = function (params, meta)
{
    // 参数命令映射表
    let { singleMap, cwd, paramsMappings } = meta;
    let workerPath = cwd || process.cwd();

    // 日志
    const Logger = new LoggerSaver("Print_Help", workerPath, singleMap.isSaveLog.include);

    let printing = false;

    params = [...new Set(params)];
    // 指令参数
    let __paramsMap = Object.values(paramsMappings);
    for (let i = 0; i < params.length; i++)
    {
        let key = params[i];

        // 排除默认参数占位符
        if (key == singleMap.dvp.key) continue;

        let paramOption = __paramsMap.find(pm => pm.mapKey == key || pm.params.key == key);

        // 如果没有找到对应的参数
        if (!paramOption)
        {
            Logger.warn(`没有找到对应的命令 [${key}]`);
            continue;
        }

        // 读取帮助文档
        let helpDocumentPath = pt.join(__dirname, "example", paramOption.params.example);

        let counter = paramOption.params.count < 0 ? "不定长参数" : paramOption.params.count;
        let defaulter = paramOption.params.count < 0 ? "无" : paramOption.params.defaults.join(", ");

        Logger.prompt(`${key}: ${paramOption.params.description} [参数命令]`).line();
        Logger.success(`参数个数：${counter}`);
        Logger.success(`默认参数：${defaulter}`).line();

        printHelpDocument(key, helpDocumentPath, Logger);

        printing = true;
    }

    // 布尔参数
    let __singleMap = Object.values(singleMap);
    for (let i = 0; i < __singleMap.length; i++)
    {
        const single = __singleMap[i];

        if (!single.include) continue;

        // 读取帮助文档
        let helpDocumentPath = pt.join(__dirname, "example", single.example);

        Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
        printHelpDocument(single.key, helpDocumentPath, Logger);

        printing = true;
    }

    if (params.length < 1 && !printing)
    {
        printDescription(paramsMappings, singleMap, Logger);
    }

    Logger.close();
}
