const fs = require("node:fs");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const Lister = require("../options/lister");

/**
 *  校验路径的有效性
 *  @param {String} path 路径
 *  @returns {Boolean}
 */
function valDirPath(path)
{
    if (!fs.existsSync(path)) return false;
    if (fs.statSync(path).isFile()) return false;

    return true;
}

/**
 *  添加一个目录路径
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    const name = (params[0] + "").trim();
    const path = (params[1] + "").trim();
    const items = Lister.findDirItems(name, path, false);

    // 检查是否重复
    if (items.length > 0)
    {
        const listLines = Lister.printLister(items, (v, i) => [v.index, v.item]);

        logger.error("已存在：");
        listLines.forEach(line => logger.info(line));
        logger.close();
        return;
    }
    // 检查路径有效性
    if (!valDirPath(path))
    {
        logger.error("无效目录：" + path).close();
        return;
    }

    // 结果
    const index = Lister.addItems(name, path);
    logger.success("添加成功！ index => " + index);

    // 保存
    const saverMessage = Lister.dirListSaver(Lister.lister());

    logger.info(saverMessage);
    logger.close();
}

module.exports = main;
