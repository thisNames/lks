const GlobalConfig = require("../../class/GlobalConfig");
const LoggerSaver = require("../../class/LoggerSaver");

module.exports = function (params, meta)
{
    // 结构化命令时的元信息 meta 里面包含了全局的参数和设置
    const { singleMap, cwd } = meta;
    const workerPath = cwd || process.cwd();

    const Logger = new LoggerSaver("Print_Global_Config_Task", workerPath, singleMap.isSaveLog.include);

    for (const key in GlobalConfig)
    {
        if (Object.prototype.hasOwnProperty.call(GlobalConfig, key))
        {
            const element = GlobalConfig[key];
            let msg = key.concat(" = ", element)
            Logger.info(msg);
        }
    }

    Logger.close();
}
