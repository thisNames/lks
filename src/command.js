/**
 *  命令配置选项
 *  所有命令配置统一代码
 */

const Params = require("./class/Params");
const Single = require("./class/Single");
const GC = require("./class/GlobalConfig");

/** @type {Map<String, Params>} 参数命令数组 */
const paramsMap = new Map();

//#region 参数命令映射表：设置参数命令映射表（优先匹配 mapKey；通配符命令 * 放在末尾）
const paramsMapping = {
    version: {
        mapKey: "-v",
        params: new Params("--version", 0, [], "显示当前版本")
    },
    help: {
        mapKey: "-h",
        params: new Params("--help", -1, [], "命令帮助，--help command1 command2 ... 可查看指定命令的帮助文档", "help.txt")
    },
    "print:global:config": {
        mapKey: "-pgc",
        params: new Params("--global:config", 0, [], "显示全局配置")
    },
    "set:recursionDeep": {
        mapKey: "-sr",
        params: new Params("--set:recursion", 1, [GC.recursionDeep], "设置递归最大深度", "params_set_recursion.txt")
    },
    "set:collectFileMaxCount": {
        mapKey: "-scf",
        params: new Params("--set:files", 1, [GC.collectFileMaxCount], "设置文件收集最大数量， 小于 1 则不做限制", "params_set_collect_file_max.txt")
    },
    "download:vpk": {
        mapKey: "-dv",
        params: new Params("--download:vpk", -1, [], "下载（免费的）Steam 创意工坊的文件", "params_download_steam_vpk.txt")
    },
    add: {
        mapKey: "-a",
        params: new Params("--add", 2, [0, 0], "相加（测试命令）", "params_test_add.txt")
    },
    "set:add": {
        mapKey: "-sa",
        params: new Params("--set:add", 1, [3], "设置相加参数个数（测试命令）值为 -1，则截取到末尾，默认参数在不生效", "params_test_set_add.txt")
    },
    "file:symlink": {
        mapKey: null,
        params: new Params("*", 1, [".vpk"], "文件创建符号链接，* 为文件所在的路径", "params_file_symlink.txt")
    }
};
//#endregion

//#region 注册参数命令
for (let key in paramsMapping)
{
    // mapKey
    if (paramsMap.has(paramsMapping[key].mapKey))
    {
        let rs = `The key [${key}.mapKey] [${paramsMapping[key].mapKey}] command has defined`;
        throw new Error(rs);
    }
    // params.key
    if ([...paramsMap.values()].find(p => p.key == paramsMapping[key].params.key))
    {
        let rs = `The [${key}.params.key] [${paramsMapping[key].params.key}] command has defined`;
        throw new Error(rs);
    }

    paramsMap.set(paramsMapping[key].mapKey, paramsMapping[key].params);
}
//#endregion

//#region 布尔命令映射表：注册布尔命令（推荐使用参数命令实现）
const singleMap = {
    isUseDefaultValue: new Single("$D", "占位符，表示使用默认参数（前提是有）", "bool_use_defaults.txt"),
    isRecursion: new Single("-R", "启用递归"),
    isSaveLog: new Single("-L", "为本次操作保存日志"),
    isShowCollectFiles: new Single("-SC", "仅显示收集到的文件集合，不创建符号链接")
};
//#endregion

module.exports = {
    paramsMap,
    paramsMapping,
    singleMap
}
