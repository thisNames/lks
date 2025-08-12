const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const DirItem = require("../class/DirItem");

const OP = require("../options/options");

/**
 *  @param {LoggerSaver} logger 日志记录器
 *  @param {Array<DirItem>} list 目录集合
 *  @returns {void}
 */
function __showList(list, logger)
{
    // 检查目录配置是否被初始化
    if (!Array.isArray(list) || list.length < 1) return logger.warn("当前收录目录列表为空");

    logger.warn(`收录的目录列表：${list.length} 项`);

    for (let i = 0; i < list.length; i++)
    {
        const item = list[i];

        let lines = `id: [${item.id}], name: [${item.name}] => ${item.path}`;

        if (i % 2 == 0)
        {
            logger.info(lines);
        }
        else
        {
            logger.prompt(lines)
        }
    }
}

/**
 *  显示已经收录的目录列表
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    __showList(OP.list, logger);

    logger.close();
}

module.exports = main;
