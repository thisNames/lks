/**
 *  src 入口文件
 *  所有命令任务统一注册代码
 */
const { paramsMapping, paramsMap, singleMap } = require("./command"); // 命令表

// 功能模块
const fileSymlink = require("./command/file_symlink");
const printHelp = require("./command/print_help");
const printGlobalConfig = require("./command/print_global_config");
const downloadVpk = require("./command/download_vpk");

// 工具类
const { isAdministrator, typeInt } = require("./class/Tools");
const GC = require("./class/GlobalConfig");
const LoggerSaver = require("./class/LoggerSaver");
const Logger = require("./class/Logger");

// 添加任务：

// 求和任务
paramsMapping["add"].params.addTask("add", function (params, meta)
{
    const Logger = new LoggerSaver("Add_Task", meta.WORKER_PATH, singleMap.isSaveLog.include);

    let sum = 0;
    for (let index = 0; index < params.length; index++)
    {
        let element = Number.parseInt(params[index]);
        sum += Number.isNaN(element) ? 0 : element;
    }

    Logger.info(`Sum of parameters: ${sum}`).close();

    return sum;
});

// 设置求和任务
paramsMapping["set:add"].params.addTask("set:add", function (params, meta)
{
    let _count = Number.parseInt(params[0]);
    let count = Number.isNaN(_count) ? paramsMapping["set:add"].params.defaults[0] : _count;

    paramsMapping["add"].params.count = count;

    if (count > 0)
    {
        paramsMapping["add"].params.defaults = new Array(count).fill(0);
    }

    return count;
});

// 打印版本号
paramsMapping["version"].params.addTask("print:version", function (params, meta)
{
    const Logger = new LoggerSaver("Version_Task", meta.WORKER_PATH, singleMap.isSaveLog.include);
    let package = require("../package.json");
    Logger.info(package.version).close();
});

// 命令帮助
paramsMapping["help"].params.addTask("print:help", printHelp);

// 打印全局配置
paramsMapping["print:global:config"].params.addTask("print:global:config", printGlobalConfig);

// 设置递归最大深度
paramsMapping["set:recursionDeep"].params.addTask("set:recursionDeep", function (params, meta)
{
    let value = typeInt(params[0], paramsMapping["set:recursionDeep"].params.defaults[0]);
    GC.recursionDeep = value;
});

// 设置文件收集最大数量
paramsMapping["set:collectFileMaxCount"].params.addTask("set:collectFileMaxCount", function (params, meta)
{
    let value = typeInt(params[0], paramsMapping["set:collectFileMaxCount"].params.defaults[0]);
    GC.collectFileMaxCount = value;
});

// 下载 Steam 创意工坊的文件（免费的）
paramsMapping["download:vpk"].params.addTask("download:vpk", downloadVpk);

// 为文件批量创建符号链接
paramsMapping["file:symlink"].params.addTask("file:symlink", function (params, meta)
{
    // 判断是不是管理员
    if (!isAdministrator()) return Logger.error("ERROR: 请使用管理员权限运行此命令");

    fileSymlink(params, {
        ...meta,
        isRecursion: singleMap.isRecursion.include,
        recursionDeep: GC.recursionDeep,
        collectFileMaxCount: GC.collectFileMaxCount,
        isSaveLog: singleMap.isSaveLog.include,
        isShowCollectFiles: singleMap.isShowCollectFiles.include
    });
});

// 程序结束
const START_TIME = Date.now();
process.addListener("exit", () =>
{
    Logger.info(`\r\nrunning time is ${Date.now() - START_TIME}ms`);
});

module.exports = {
    paramsMap,
    singleMap,
    paramsMapping
}
