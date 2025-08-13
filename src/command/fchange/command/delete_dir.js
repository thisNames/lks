const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");
const Tools = require("../../../class/Tools");

const Lister = require("../options/lister");

/**
 *  解析 index 参数
 *  @param {Array<String>} params 参数集合
 *  @returns {Array<Number>} index 集合
 */
function parIndex(params)
{
    const listId = new Set();

    for (let i = 0; i < params.length; i++)
    {
        const id = params[i];
        const interval = id.split("~");

        // 单个
        if (interval.length < 2)
        {
            const __id = Number.parseInt(interval[0]);
            Number.isFinite(__id) && listId.add(__id);
            continue;
        }

        // 区间
        const left = Number.parseInt(interval[0]);
        const right = Number.parseInt(interval[1]);

        if (!Number.isFinite(left) || !Number.isFinite(right) || left < 0 || left > right) continue;

        for (let j = left; j <= right; j++)
        {
            if (listId.has(j)) continue;
            listId.add(j);
        }
    }

    return [...listId];
}

/**
 *  使用 id 查找
 *  @param {Array<Number>} listIndex 索引列表
 *  @returns {Array<{index: Number, item: DirItem}>}
 */
function findsForIndex(listIndex)
{
    const list = Lister.lister();
    const results = [];

    for (let i = 0; i < listIndex.length; i++)
    {
        const index = listIndex[i];

        if (index > list.length - 1) continue;

        const dItem = list[index];

        if (!dItem) continue;

        results.push({
            index: index,
            item: dItem
        });
    }

    return results;
}

/**
 *  添加一个目录路径
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
async function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);
    const ids = parIndex(params);
    const yes = ["y", "yes", "ye"];

    // 不合法的 index
    if (ids.length < 1)
    {
        logger.error("无效索引！请输入：1~10 1 2 3").close();
        return;
    }

    // 提示
    const items = findsForIndex(ids);

    // 空
    if (items.length < 1)
    {
        logger.error("没有找到符合的项").close();
        return;
    }

    // 提示信息
    Lister.printLister(items, (v, i) => [v.index, v.item]).forEach((line, i) => logger.success(line));
    logger.tip(`确认删除：[${yes.join(", ")}]`);

    // 提示确认删除
    const input1 = await Tools.terminalInput().catch(m => m);

    // 取消操作
    if (!yes.includes(input1))
    {
        logger.info("取消删除").close();
        return;
    }

    // 删除操作
    const delList = Lister.deleteItems(ids);

    logger.success(`成功删除：${delList.length}`);
    Lister.printLister(delList, (v, i) => [v.index, v.item]).forEach((line, i) => logger.error(line));

    // 保存
    const saverMessage = Lister.dirListSaver(Lister.lister());

    logger.info(saverMessage);
    logger.close();
}

module.exports = main;
