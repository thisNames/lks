/**
 *  命令配置选项
 *  所有命令配置统一代码
 */

const Params = require("./class/Params");
const Single = require("./class/Single");
const { comment } = require("./class/Tools");
const GC = require("./class/GlobalConfig");

/**
 *  @type {Map<String, Params>} 参数命令数组
 */
const paramsMap = new Map();

//#region 设置参数命令映射表（优先匹配 mapKey；通配符命令 * 放在末尾）
const paramsMapping = {
    version: {
        mapKey: "-v",
        params: new Params("--version", 0, [], "显示当前版本")
    },
    help: {
        mapKey: "-h",
        params: new Params("--help", 0, [], "命令帮助")
    },
    "print:global:config": {
        mapKey: "-pc",
        params: new Params("--config", 0, [], "显示全局配置")
    },
    "set:recursionDeep": {
        mapKey: "-sr",
        params: new Params("--set:recursion", 1, [GC.recursionDeep], "设置递归最大深度")
    },
    "set:collectFileMaxCount": {
        mapKey: "-scf",
        params: new Params("--set:files", 1, [GC.collectFileMaxCount], "设置文件收集最大数量， 小于1则不做限制")
    },
    add: {
        mapKey: "-a",
        params: new Params("--add", 2, [0, 0], comment("相加（测试命令）", "FE: -a 10 20"))
    },
    "set:add": {
        mapKey: "-sa",
        params: new Params("--set:add", 1, [3], comment("设置相加参数个数（测试命令）值为 -1，则截取到末尾，默认参数在不生效", "FE: -sa 3"))
    },
    "file:symlink": {
        mapKey: null,
        params: new Params("*", 1, [".vpk"], comment("批量为文件创建符号链接，* 为文件所在的路径", "FE: C:/AAA/BBB/CCC <后缀名称>"))
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

//#region 注册布尔命令
const singleMap = {
    isUseDefaultValue: new Single("$D", comment("占位符，表示使用默认参数（前提是有）", "FE: -a $D 90")),
    isRecursion: new Single("-R", comment("使用递归", "FE: C:/AA/BB/CC .vpk -R")),
    isSaveLog: new Single("-L", comment("为本次操作保存日志", "FE: C:/AA/BB/CC .vpk -R -L"))
};
//#endregion

module.exports = {
    paramsMap,
    paramsMapping,
    singleMap
}
