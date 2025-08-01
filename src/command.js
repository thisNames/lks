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

//#region 初始化常量
// 模块所在的目录名称
const COMMAND_DIR_NAME = "command";

// module.exports 的文件名称
const COMMAND_NAME = "command";

/** @type {Map<String, Params>} 参数命令映射表 */
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
    const command = fs.readdirSync(COMMAND_PATH)
        .map(f => path.join(COMMAND_PATH, f, COMMAND_NAME + ".js"))
        .filter(f => fs.existsSync(f) && fs.statSync(f).isFile())

    return command;
}

/**
 *  抛出异常
 *  @version 0.0.1
 *  @param {Error} error 抛出异常对象
 *  @throws {Error}
 */
function throwError(error)
{
    throw error;
}

/**
 *  获取模块并填充
 *  @version 0.0.2
 *  @param {String[]} models 模块所在路径集合
 *  @returns {void}
 */
function fillParamsMapping(models)
{
    let paramsKeySet = new Set();

    for (let i = 0; i < models.length; i++)
    {
        const model = models[i];
        const m = require(model);

        if (!Array.isArray(m)) throwError(`Parameter type error (${model}), must return a [Array<class/ParamsMapping>]`);

        for (let j = 0; j < m.length; j++)
        {
            const paramsMapping = m[j];

            if (paramsMapping instanceof ParamsMapping)
            {
                paramsMapping.params.__model = model;

                // 检测重复定义
                if (PARAMS_MAP.has(paramsMapping.mapKey) || PARAMS_MAP.has(paramsMapping.params.key) || paramsKeySet.has(paramsMapping.params.key) || paramsKeySet.has(paramsMapping.mapKey))
                    throwError(new TypeError(`The command is defined repeatedly in module [${paramsMapping.params.__model || "unknown module"}]`));

                PARAMS_MAP.set(paramsMapping.mapKey, paramsMapping.params);
                paramsKeySet.add(paramsMapping.params.key);

                continue;
            }

            throwError(`Parameter type error (${model}), must return a [class/ParamsMapping]`);
        }
    }

    paramsKeySet.clear();
    paramsKeySet = null;
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
    SINGLE_MAP
}
