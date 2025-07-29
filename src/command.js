/**
 *  注册命令参
 */

const fs = require("node:fs");
const path = require("node:path");

const ParamsMapping = require("./class/ParamsMapping");
const Params = require("./class/Params");
const Single = require("./class/Single");
const Tools = require("./class/Tools");

//#region 初始化常量
/** @type {Array<ParamsMapping>} 参数命令映射表（参数命令列表）*/
const PARAMS_MAPPINGS = [];

/** @type {String} 命令模块根目录 */
const COMMAND_PATH = path.join(__dirname, "command");

/** @type {Map<String, Params>} 参数命令数组 */
const PARAMS_MAP = new Map();
//#endregion


//#region 获取模块
const command = fs.readdirSync(COMMAND_PATH).filter(f => fs.statSync(path.join(COMMAND_PATH, f)).isDirectory());
const models = command.map(f => `./command/${f}/command.js`);

for (let i = 0; i < models.length; i++)
{
    const model = models[i];
    const m = require(model);

    if (!Array.isArray(m)) throw new TypeError(`Parameter type error (${model}), must return a [class/ParamsMapping] array`);

    for (let j = 0; j < m.length; j++)
    {
        const paramsMapping = m[j];

        if (!paramsMapping instanceof ParamsMapping) throw new TypeError(`Parameter type error (${model}), must return a [class/ParamsMapping]`);

        paramsMapping.params.__model = model;
        PARAMS_MAPPINGS.push(paramsMapping);
    }
}

/** @type {Array<ParamsMapping>} 重复的参数命令对象*/
const repDefParamsKeys = Tools.findDuplicates(PARAMS_MAPPINGS, p => p.params.key, false);

/** @type {Array<ParamsMapping>} 重复的参数命令对象*/
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
//#endregion


//#region 注册参数命令
PARAMS_MAPPINGS.sort((p1, p2) => p2.params.index - p1.params.index).forEach(paramsMapping => PARAMS_MAP.set(paramsMapping.mapKey, paramsMapping.params));
//#endregion

//#region 布尔命令映射表：注册布尔命令（推荐使用参数命令实现）
const SINGLE_MAP = {
    isUseDefaultValue: new Single("$D", "占位符，表示使用默认参数（前提是有）", "bool_use_defaults.txt"),
    isRecursion: new Single("-R", "启用递归"),
    isSaveLog: new Single("-L", "为本次操作保存日志"),
    isShowCollectFiles: new Single("-SC", "仅显示收集到的文件集合，不创建符号链接")
};
//#endregion

module.exports = {
    paramsMap: PARAMS_MAP,
    paramsMapping: PARAMS_MAPPINGS,
    singleMap: SINGLE_MAP
}
