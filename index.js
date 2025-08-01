/**
 *  @version 0.0.2
 *  @description 主执行文件（入口）
 */

// class
const Params = require("./src/class/Params");
const MainRunningMeta = require("./src/class/MainRunningMeta");

// src index.js
const { PARAMS_MAP, SINGLE_MAP, PARAMS_KEY_MAP } = require("./src");
const Single = require("./src/class/Single");

//#region 初始化常量
const STATIC_META = new MainRunningMeta({
    dirname: __dirname,
    filename: __filename,
    singleMap: SINGLE_MAP,
    paramsMap: PARAMS_MAP,
    paramsKeyMap: PARAMS_KEY_MAP
});
//#endregion

/**
 *  填充指令参数
 *  @version 0.0.1
 *  @param {Params} pm 参数命令对象
 *  @param {String} dvpKey 默认参数占位符
 *  @returns {Params} 原来的参数命令对象
 */
function fillParams(pm, dvpKey)
{
    // 如果值为小于0，那么后面的参数都将作为 params 的参数，defaults 参数将不会生效
    if (pm.count < 0)
    {
        while (process.argv.length > 0)
        {
            let pv = process.argv.shift();
            pm.params.push(pv);
        }
        return pm;
    }

    // 填充参数
    for (let i = 0; i < pm.count; i++)
    {
        if (process.argv.length < 1)
        {
            // 使用默认参数
            pm.params.push(pm.defaults[i]);
            continue;
        }
        // 使用命令参数
        let pv = process.argv.shift();
        pm.params.push(pv == dvpKey ? pm.defaults[i] : pv);
    }

    return pm;
}

/**
 *  初始化命令
 *  @version 0.0.1
 *  @param {Array<Single>} singles 忽略布尔命令
 *  @param {String} ignoreKey 不跳过的 key
 *  @returns {void}
 */
function initProcessArgs(singles, ignoreKey)
{
    // 去掉第一个参数和第二个参数，因为它们分别是 node 和入口文件路径 index.js
    process.argv.splice(0, 2);

    process.argv = process.argv.filter(arg =>
    {
        const single = singles.find(single => single.key == arg);

        if (single)
        {
            single.include = true;
            return single.key == ignoreKey;
        }

        return true;
    });
}

/**
 *  运行主函数
 *  @version 0.0.2
 *  @param {Map<String, Params>} paramsMap 参数命令映射表 mapKey
 *  @param {Map<String, Params>} paramKeyMap 参数命令映射表 params.key
 *  @param {String} dvpKey 默认参数占位符
 *  @param {MainRunningMeta} meta 静态数据对象
 *  @returns {void}
 */
function running(paramsMap, dvpKey, meta, paramKeyMap)
{
    // 解析参数并运行
    while (process.argv.length > 0)
    {
        let key = process.argv.shift();
        // 通过 mapKey || params.key || * 通配符参数命令 取值筛选
        let pm = paramsMap.get(key) || paramKeyMap.get(key) || paramKeyMap.get("*");

        if (!pm || pm.include) continue;

        pm.include = true;

        // 填充参数 运行任务
        fillParams(pm, dvpKey).running({ ...meta, key });
        console.log(pm); // TODO: debug line comment
    }
}

/**
 *  running 运行结束
 *  @version 0.0.1
 *  @returns {void}
 */
function end()
{
    // 啥也不输出了 >A< >_< >V< ...
}

/**
 *  运行主入口
 *  @version 0.0.1
 *  @returns {void}
 */
function main()
{
    // 初始化参数（去掉无关的参数）
    initProcessArgs(Object.values(SINGLE_MAP), SINGLE_MAP.dvp.key);

    // 运行任务
    running(PARAMS_MAP, SINGLE_MAP.dvp.key, STATIC_META, PARAMS_KEY_MAP);

    // 运行结束
    end();
}

// 运行主入口
main();
