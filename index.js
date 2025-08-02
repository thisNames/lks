/**
 *  @version 0.0.3
 *  @description 主执行文件（入口）
 */

// class
const Params = require("./src/class/Params");
const MainRunningMeta = require("./src/class/MainRunningMeta");
const Tools = require("./src/class/Tools");
const Single = require("./src/class/Single");

// src index.js
const { PARAMS_MAP, SINGLE_MAP, PARAMS_KEY_MAP } = require("./src");

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
 *  指定区间填充指令参数
 *  @version 0.0.1
 *  @param {Params} pm 参数命令对象
 *  @param {String} dvpKey 默认参数占位符
 *  @param {Number} index 从第几个开始截取
 *  @returns {Params} 原来的参数命令对象
 */
function fillParamsFSplice(pm, dvpKey, index)
{
    if (pm.count < 0)
    {
        // 如果值为小于0，那么后面的参数都将作为 params 的参数，defaults 参数将不会生效，直接截取到末尾
        pm.params.push(...process.argv.splice(index, process.argv.length - index));
        return pm;
    }

    // 使用命令参数
    let pvs = process.argv.splice(index, pm.count);
    for (let i = 0; i < pm.count; i++)
    {
        if (pvs.length < 1) // 1
        {
            // 使用默认参数 1 2
            pm.params.push(pm.defaults[i]);
            continue;
        }
        let pv = pvs[i];
        pm.params.push(pv == dvpKey ? pm.defaults[i] : pv);

    }

    return pm;
}

/**
 *  初始化命令
 *  @version 0.0.1
 *  @param {MainRunningMeta} meta 忽略布尔命令
 *  @returns {void}
 */
function initProcessArgs(meta)
{
    // 去掉第一个参数和第二个参数，因为它们分别是 node 和入口文件路径 index.js
    process.argv.splice(0, 2);

    /** @type {Map<String, Single>} */
    const singleMap = Tools.objectFMap(meta.singleMap, (k, v) => v.key, (k, v) => v);

    let i = 0
    for (; i < process.argv.length; i++)
    {
        const key = process.argv[i];
        const single = singleMap.get(key);

        // 处理布尔参数
        if (single)
        {
            single.include = true;
            if (process.argv[i] == meta.singleMap.dvp.key) continue;

            // 踢出去匹配到的指令，并且倒退回去，继续下次循环判断是否还有下一个指令
            process.argv.splice(i, 1);
            i--;
            continue;
        }

        // 处理带 before 的参数命令
        let pm = meta.paramsMap.get(key) || meta.paramsMap.get(key) || meta.paramsMap.get("*");
        if (!pm || pm.include || !pm.before) continue;

        fillParamsFSplice(pm, meta.singleMap.dvp, i + 1).running({ ...meta, key });

        // 踢出去匹配到的指令，并且倒退回去，继续下次循环判断是否还有下一个指令
        process.argv.splice(i, 1);
        i--;
    }
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
    // 初始化参数
    initProcessArgs(STATIC_META);

    // 运行任务
    running(PARAMS_MAP, SINGLE_MAP.dvp.key, STATIC_META, PARAMS_KEY_MAP);

    // 运行结束
    end();
}

// 运行主入口
main();
