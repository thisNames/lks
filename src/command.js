/**
 *  注册命令参数模块
 *  @version 0.0.1
 */

const fs = require("node:fs");
const path = require("node:path");

// class
const ParamsMapping = require("./class/ParamsMapping");
const Params = require("./class/Params");
const Single = require("./class/Single");
const Tools = require("./class/Tools");

//#region 初始化常量
// 模块所在的目录名称
const COMMAND_DIR_NAME = "command";

// module.exports 的文件名称
const COMMAND_NAME = "command";

/** @type {Array<ParamsMapping>} 参数命令映射表（参数命令列表）*/
const PARAMS_MAPPINGS = [];

/** @type {Map<String, Params>} 参数命令数组 */
const PARAMS_MAP = new Map();
//#endregion

//#region 布尔命令映射表：注册布尔命令（推荐使用参数命令实现 ParamsMapping）
const SINGLE_MAP = {
    dvp: new Single("$D", "占位符，表示使用默认参数（前提是有）", "bool_use_defaults.txt"),
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
    const command = fs.readdirSync(COMMAND_PATH).filter(f => fs.statSync(path.join(COMMAND_PATH, f)).isDirectory());
    const models = command.map(f => `./${COMMAND_DIR_NAME}/${f}/${COMMAND_NAME}.js`);

    return models;
}

/**
 *  获取模块
 *  @version 0.0.1
 *  @param {String[]} models 模块所在路径集合
 *  @returns {void}
 */
function fillParamsMapping(models)
{
    for (let i = 0; i < models.length; i++)
    {
        const model = models[i];
        const m = require(model);

        if (!Array.isArray(m)) throw new TypeError(`Parameter type error (${model}), must return a [Array<class/ParamsMapping>]`);

        for (let j = 0; j < m.length; j++)
        {
            const paramsMapping = m[j];

            if (paramsMapping instanceof ParamsMapping)
            {
                paramsMapping.params.__model = model;
                PARAMS_MAPPINGS.push(paramsMapping);
                continue;
            }

            throw new TypeError(`Parameter type error (${model}), must return a [class/ParamsMapping]`);
        }
    }
}

/**
 *  检查是否有重复的键
 *  @version 0.0.1
 *  @returns {void}
 */
function checkParamsMapping()
{
    /** @type {Array<ParamsMapping>} 重复的参数命令对象，找到一个就跳出 */
    const repDefParamsKeys = Tools.findDuplicates(PARAMS_MAPPINGS, p => p.params.key, false);

    /** @type {Array<ParamsMapping>} 重复的参数命令对象，找到一个就跳出 */
    const repDefMapKeys = Tools.findDuplicates(PARAMS_MAPPINGS, p => p.mapKey, false);

    for (let i = 0; i < repDefMapKeys.length; i++)
    {
        const paramsMapping = repDefParamsKeys[i];
        throw new Error(`The "mapKey" command [${paramsMapping.mapKey}] is defined repeatedly in module ${paramsMapping.params.__model}`);
    }

    for (let i = 0; i < repDefParamsKeys.length; i++)
    {
        const paramsMapping = repDefParamsKeys[i];
        throw new Error(`The "params.key" command [${paramsMapping.mapKey}] is defined repeatedly in module ${paramsMapping.params.__model}`);
    }
}

/**
 *  注册参数命令
 *  @version 0.0.1
 *  @returns {void}
 */
function registerParamsMapping()
{
    PARAMS_MAPPINGS.sort((p1, p2) => p2.params.index - p1.params.index).forEach(paramsMapping => PARAMS_MAP.set(paramsMapping.mapKey, paramsMapping.params));
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

    // 检查重复
    checkParamsMapping();

    // 注册模块
    registerParamsMapping();
}

// 调用主函数
main();

module.exports = {
    PARAMS_MAP,
    PARAMS_MAPPINGS,
    SINGLE_MAP
}
