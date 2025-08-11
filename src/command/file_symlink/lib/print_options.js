const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const OP = require("./option");

/**
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(param, meta, __this, taskName)
{
    let workerFolder = meta.cwd || process.cwd();
    const Logger = new LoggerSaver(taskName, workerFolder, meta.singleMap.isSaveLog.include);

    for (const key in OP)
    {
        if (Object.prototype.hasOwnProperty.call(OP, key))
        {
            const value = OP[key];
            Logger.info(`${key} = ${value}`);
        }
    }

    Logger.close();
}


module.exports = main;
