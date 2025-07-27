/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const Logger = require("../../class/Logger");

/**
 *  打印简单描述
 *  @param {Object} PMG 参数命令映射表
 *  @param {Object} SM 布尔命令映射表
 */
function printDescription(PMG, SM)
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
 */
function printHelpDocument(key, helpDocumentPath)
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
    let { PMG, SM } = meta;
    let printing = false;

    params = [...new Set(params)];
    // 指令参数
    let paramsMap = Object.values(PMG);
    for (let i = 0; i < params.length; i++)
    {
        let key = params[i];
        let paramOption = paramsMap.find(pm => pm.mapKey == key || pm.params.key == key);

        if (!paramOption) continue;

        // 读取帮助文档
        let helpDocumentPath = pt.join(__dirname, "example", paramOption.params.example);

        let counter = paramOption.params.count < 0 ? "不定长参数" : paramOption.params.count;
        let defaulter = paramOption.params.count < 0 ? "无" : paramOption.params.defaults.join(", ");

        Logger.prompt(`${key}: ${paramOption.params.description} [参数命令]`).line();
        Logger.success(`参数个数：${counter}`);
        Logger.success(`默认参数：${defaulter}`).line();

        printHelpDocument(key, helpDocumentPath);

        printing = true;
    }

    // 布尔参数
    let singleMap = Object.values(SM);
    for (let i = 0; i < singleMap.length; i++)
    {
        const single = singleMap[i];

        if (!single.include) continue;

        // 读取帮助文档
        let helpDocumentPath = pt.join(__dirname, "example", single.example);

        Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
        printHelpDocument(single.key, helpDocumentPath);

        printing = true;
    }

    if (params.length < 1 && !printing) return printDescription(PMG, SM);
}
