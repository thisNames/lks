const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const Lister = require("../options/lister");

/**
 *  搜索一个目录
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);
    const search = (params[0] + "").trim();
    const results = Lister.findDirItems(search, search, true);

    // 空
    if (results.length < 1) return logger.error("未搜索到符合的目录");

    logger.success(`共搜索到 ${results.length} 项：`);
    Lister.printLister(results, (v, i) => [v.index, v.item]).forEach(line => logger.light(line));

    logger.close();
}

module.exports = main;
