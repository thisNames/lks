/**
 *  src 入口文件
 *  所有命令任务统一注册代码
 */
const { paramsMapping, paramsMap, singleMap } = require("./command"); // 命令表

// 功能模块
const fileSymlink = require("./command/file_symlink");
const printHelp = require("./command/print_help");
const printGlobalConfig = require("./command/print_global_config");

// 工具类
const { isAdministrator, typeInt } = require("./class/Tools");
const GC = require("./class/GlobalConfig");
const Logger = require("./class/Logger");

// 添加任务：

// 求和任务
paramsMapping["add"].params.addTask("add", function (params, meta)
{
    let sum = 0;
    for (let index = 0; index < params.length; index++)
    {
        let element = Number.parseInt(params[index]);
        sum += Number.isNaN(element) ? 0 : element;
    }

    console.log("run: ", sum);// TODO: debug line comment

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
    let package = require("../package.json");
    Logger.info(package.version);
});

// 命令帮助
paramsMapping["help"].params.addTask("print:help", function (params, meta)
{
    printHelp(params, { ...meta, PMG: paramsMapping, SM: singleMap });
});

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

// 为文件批量创建符号链接
paramsMapping["file:symlink"].params.addTask("file:symlink", function (params, meta)
{
    // 判断是不是管理员
    if (!isAdministrator()) return Logger.error("ERROR: 请使用管理员权限运行此命令");

    fileSymlink(params, {
        ...meta,
        isRecursion: process.argv.includes(singleMap.isRecursion.key),
        recursionDeep: GC.recursionDeep,
        collectFileMaxCount: GC.collectFileMaxCount,
        isSaveLog: process.argv.includes(singleMap.isSaveLog.key),
        isShowCollectFiles: process.argv.includes(singleMap.isShowCollectFiles.key)
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
    singleMap
}
