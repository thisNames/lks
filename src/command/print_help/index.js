/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../class/LoggerSaver");
const MainRunningMeta = require("../../class/MainRunningMeta");
const Params = require("../../class/Params");
const Tools = require("../../class/Tools");
const Single = require("../../class/Single");

const LINES = "=".repeat(20);

/**
 *  检查依赖
 *  @param {MainRunningMeta} meta meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {Boolean}
 */
function checkRequired(meta, Logger)
{
    const dirname = meta.dirname + "";

    if (fs.existsSync(pt.join(dirname + "", "node_modules"))) return true;

    let hello = [];
    let logo = "";

    try
    {
        hello = fs.readFileSync(pt.join(__dirname, "./example/hello.txt"), { encoding: "utf-8" }).split("\n").filter(s => s);
    } catch (error)
    {
        Logger.warn("...哎呀，出错啦！");
        return true;
    }

    const title = hello[0];
    const setNPMRegistry = hello[1];
    const installDeps = hello[2];
    const newInstallDeps = hello[3]

    Logger.warn(title);
    Logger.info(hello[4]).prompt(setNPMRegistry);
    Logger.info(hello[5]).prompt(installDeps);
    Logger.info(hello[6]).prompt(newInstallDeps);
    Logger.line().info(`项目目录：（建议设置环境变量）`).success("    " + dirname);

    Logger.line().info(hello[7]);
    Logger.info(hello[8]);
    Logger.info(hello[9]);
    Logger.info(hello[10]);
    Logger.warn(hello[11]);

    Logger.line().info(hello[12]);

    // logo
    try
    {
        logo = fs.readFileSync(pt.join(__dirname, "./example/logo.txt"), { encoding: "utf-8" });
    } catch (error)
    {
        logo = "this logo. l-g (loading...)";
    }

    Logger.line().info(logo);

    return false;
}

/**
 *  打印描述
 *  @param {MainRunningMeta} meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printDescriptions(meta, Logger)
{
    // 参数命令
    Logger.prompt("[参数命令]");

    /**
     * @param {Array<Params>} params 
     */
    function __print(params, __table = "")
    {
        for (let i = 0; i < params.length; i++)
        {
            const param = params[i];

            let __tableTmp = "" + __table;
            let line = `${__tableTmp}[${param.mapKey}, ${param.key}]: ${param.description}`;

            Logger.info(line);

            if (param.children.length < 1) continue;

            __print(param.children, __table + "\t");
        }

        Logger.line();
    }

    __print(meta.originListParamsMapping);

    // 布尔命令
    Logger.prompt("[布尔命令]");
    for (let key in meta.singleMap)
    {
        let single = meta.singleMap[key];
        Logger.info(`[${single.key}]: ${single.description}`);
    }
    Logger.line();

    // 仓库
    const package = require("../../../package.json");
    Logger.warn("[获取更多]");
    package.repositorys.forEach(item => Logger.info(`  ${item.url} (${item.type})`));
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
        Logger.warn(`此命令[${key}]没有找到帮助描述文件`);
    }

    Logger.info(LINES);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令
 *  @param {Params} pm pm
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printParamsExamples(key, pm, Logger)
{
    let helpDocumentPath = pt.join(pt.dirname(pm.modulePath), pm.example + "");

    let counter = pm.count < 0 ? "不定长参数" : pm.count;
    let defaulter = pm.count <= 0 ? "无" : `[${pm.defaults.join(", ")}]`;

    Logger.prompt(`[${key}]: ${pm.description} [参数命令]`);
    Logger.tip("参数说明：");
    Logger.info(`\t参数个数：${counter}`).info(`\t默认参数：${defaulter}`);

    // 子命令
    if (pm.children.length)
    {
        Logger.tip("子命令：")
        for (let i = 0; i < pm.children.length; i++)
        {
            const cpm = pm.children[i];
            Logger.info(`\t${cpm.mapKey}: ${cpm.key}`);
        }
    }
    Logger.tip("说明文档：");
    printHelpDocument(key, helpDocumentPath, Logger);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令s
 *  @param {Single} single single
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printSingleExamples(key, single, Logger)
{
    let helpDocumentPath = pt.join(pt.dirname(single.modulePath), single.example + "");

    Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
    printHelpDocument(key, helpDocumentPath, Logger);
}

/**
 *  打印模板
 *  @param {MainRunningMeta} meta meta
 *  @param {Array<String>} params 参数数组
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printExamples(meta, params, Logger)
{
    /** @type {Map<String, Single>} */
    const singleMap = Tools.objectFMap(meta.singleMap, (k, v) => v.key, (k, v) => v);

    for (let i = 0; i < params.length; i++)
    {
        const key = params[i];
        let exp = meta.paramsMap.get(key) || meta.paramsKeyMap.get(key) || singleMap.get(key);

        // 没有找到
        if (!exp)
        {
            Logger.error(`没有找到对应的命令[${key}]`);
            continue;
        }

        if (exp instanceof Params)
        {
            printParamsExamples(key, exp, Logger);
        }
        else if (exp instanceof Single)
        {
            printSingleExamples(key, exp, Logger);
        }
    }
}

/**
 *  入口函数
 *  @param {Array<String>} params 参数数组
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前运行的参数命令对象
 *  @returns {void}
 */
function main(params, meta, __this)
{
    const Logger = new LoggerSaver("Print_Help_Task", meta.cwd, meta.singleMap.isSaveLog.include);

    if (!checkRequired(meta, Logger)) return Logger.close();

    let hIndex = process.argv.findIndex(key => key == meta.key);

    let __params = [...new Set(process.argv.slice(hIndex + 1, process.argv.length))];

    // 简单描述
    if (__params.length < 1)
    {
        printDescriptions(meta, Logger);
        Logger.close();
        return;
    }

    printExamples(meta, __params, Logger);

    Logger.close();
}


module.exports = main;
