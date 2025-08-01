/**
 *  自动注册参数命令模块
 *  @version 0.0.1
 */

const fs = require("node:fs");
const path = require("node:path");

// class
const ParamsMapping = require("./class/ParamsMapping");
const Params = require("./class/Params");
const Single = require("./class/Single");
const Logger = require("./class/Logger");

//#region 初始化常量
// 模块所在的目录名称
const COMMAND_DIR_NAME = "command";

// module.exports 的文件名称
const COMMAND_NAME = "command.js";

/** @type {Map<String, Params>} mayKey 参数命令映射表 */
const PARAMS_MAP = new Map();

/** @type {Map<String, Params>} params.key 参数命令映射表 */
const PARAMS_KEY_MAP = new Map();
//#endregion

//#region 布尔命令映射表：注册布尔命令（推荐使用参数命令实现 ParamsMapping）
const SINGLE_MAP = {
    dvp: new Single("$D", "占位符，表示使用默认参数（前提是有）", "print_help/example/bool_use_defaults.txt"),
    isRecursion: new Single("-R", "启用递归"),
    isSaveLog: new Single("-L", "为本次操作保存日志"),
    isShowCollectFiles: new Single("-SC", "仅显示收集到的文件集合，不创建符号链接")
};
//#endregion

/**
 *  获取模块所在路径
 *  @version 0.0.1
 *  @returns {String[]} module.exports 文件路径集合
 */
function getModelRequirePath()
{
    const COMMAND_PATH = path.join(__dirname, COMMAND_DIR_NAME);
    const modules = [];

    try
    {
        const folders = fs.readdirSync(COMMAND_PATH, { encoding: "utf-8", withFileTypes: true });

        for (let i = 0; i < folders.length; i++)
        {
            const f = folders[i];

            if (f.isFile()) continue;

            modules.push(path.join(COMMAND_PATH, f.name, COMMAND_NAME));
        }

    } catch (error)
    {
        Logger.error(`Module load error, ${error.message}. Please check command folder`);
        return modules;
    }

    return modules;
}

/**
 *  抛出多次定义命令的错误信息
 *  @version 0.0.1
 *  @param {String} message 错误信息前缀
 *  @param {String} m1 模块 1 路径
 *  @param {String} m2 模块 2 路径
 */
function repeatedlyDefinedError(message = "repeatedlyDefinedError", m1 = "unknown1", m2 = "unknown2")
{
    throw new Error(message + `\r\ndefined 1: ${m1}\r\ndefined 2: ${m2}`);
}

/**
 *  获取模块并填充
 *  @version 0.0.2
 *  @param {String[]} models 模块所在路径集合
 *  @returns {void}
 */
function fillParamsMapping(models)
{
    for (let i = 0; i < models.length; i++)
    {
        const model = models[i];
        let m = null;

        try
        {
            m = require(model);
        } catch (error)
        {
            Logger.warn(`Module load error in [${model}], ${error.message}. Please check module`);
            continue;
        }

        if (!Array.isArray(m))
        {
            Logger.warn(`Module return type error in [${model}], expected [Array<class/${ParamsMapping.name}>]. Please check module`);
            continue;
        }

        for (let j = 0; j < m.length; j++)
        {
            /** @type {ParamsMapping} */
            const paramsMapping = m[j];

            if (!paramsMapping instanceof ParamsMapping) continue;

            paramsMapping.params.__model = model;

            // 检测重复定义
            let includeMapKey = PARAMS_MAP.get(paramsMapping.mapKey);
            if (includeMapKey) repeatedlyDefinedError(`Repeatedly defined command [mapKey]: ${paramsMapping.mapKey}`, includeMapKey.__model, paramsMapping.params.__model);

            let includeParamsKey = PARAMS_KEY_MAP.get(paramsMapping.params.key);
            if (includeParamsKey) repeatedlyDefinedError(`Repeatedly defined command [params.key]: ${paramsMapping.params.key}`, includeParamsKey.__model, paramsMapping.params.__model);

            // 注册：两个映射表皆注册了当前命令的对象
            PARAMS_MAP.set(paramsMapping.mapKey, paramsMapping.params);
            PARAMS_KEY_MAP.set(paramsMapping.params.key, paramsMapping.params);
        }
    }
}

/**
 *  主函数，注册参数命令模块
 *  @version 0.0.1
 *  @returns {void}
 */
function main()
{
    // 获取模块
    const models = getModelRequirePath();

    // 填充模块
    fillParamsMapping(models);
}

// 调用主函数
main();

module.exports = {
    PARAMS_MAP,
    SINGLE_MAP,
    PARAMS_KEY_MAP
}
