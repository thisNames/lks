const GC = require("../../class/GlobalConfig");
const LoggerSaver = require("../../class/LoggerSaver");

module.exports = function (params, meta)
{
    const Logger = new LoggerSaver("Print_Global_Config_Task", meta.WORKER_PATH, meta.singleMap.isSaveLog.include);

    for (const key in GC)
    {
        if (Object.prototype.hasOwnProperty.call(GC, key))
        {
            const element = GC[key];
            let msg = key.concat(" = ", element)
            Logger.info(msg);
        }
    }

    Logger.close();
}
