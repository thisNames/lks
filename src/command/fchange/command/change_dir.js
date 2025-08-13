const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const Lister = require("../options/lister");
const OP = require("../options/options");

/**
 *  使用索引查找
 *  @param {Number} searchIndex 索引
 *  @returns {String}
 */
function openForIndex(searchIndex)
{
    const lister = Lister.lister();
    const dItem = lister[searchIndex];

    if (!dItem) return `[${searchIndex}] 不存在，请使用 [-fd-l] 列出可选择的目录`;

    const result = OP.terminal ? dItem.change() : dItem.open();

    return result;
}

/**
 *  使用搜索参数查找
 *  @param {String} search name of path
 *  @returns {String}
 */
function openForSearch(search)
{
    const list = Lister.findDirItems(search, search, true);

    if (list.length < 1) return `未发现与 [${search}] 匹配的选项`;

    const dItem = list[0].item;
    const result = OP.terminal ? dItem.change() : dItem.open();

    return result;
}

/**
 *  修改当前路径命令
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    const search = (params[0] + "").trim();
    const searchIndex = Number.parseInt(search);
    const result = Number.isFinite(searchIndex) ? openForIndex(searchIndex) : openForSearch(search);

    result ? logger.success(result) : logger.error("执行失败");

    logger.close();
}

module.exports = main;
