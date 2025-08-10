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
module.exports = function (param, meta, __this, taskName)
{
    const Logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    for (const key in OP)
    {
        if (Object.prototype.hasOwnProperty.call(OP, key))
        {
            const value = OP[key];
            const content = Array.isArray(value) ? value.join(", ") : value;
            const line = `${key} = ${content}`;

            Logger.info(line);
        }
    }

    Logger.close();
};
