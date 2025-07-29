/**
 *  src 入口文件
 *  所有命令任务统一注册代码
 */
const { paramsMapping, paramsMap, singleMap } = require("./command"); // 命令表

// 工具类
const { isAdministrator } = require("./class/Tools");
const Logger = require("./class/Logger");

// // 下载 Steam 创意工坊的文件（免费的）
// paramsMapping["download:vpk"].params.addTask("download:vpk", downloadVpk);

// // 为文件批量创建符号链接
// paramsMapping["file:symlink"].params.addTask("file:symlink", function (params, meta)
// {
//     // 判断是不是管理员
//     if (!isAdministrator()) return Logger.error("ERROR: 请使用管理员权限运行此命令");

//     fileSymlink(params, {
//         ...meta,
//         isRecursion: singleMap.isRecursion.include,
//         recursionDeep: GC.recursionDeep,
//         collectFileMaxCount: GC.collectFileMaxCount,
//         isSaveLog: singleMap.isSaveLog.include,
//         isShowCollectFiles: singleMap.isShowCollectFiles.include
//     });
// });

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
