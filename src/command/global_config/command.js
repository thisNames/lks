const ParamsMapping = require("../../class/ParamsMapping");
const LoggerSaver = require("../../class/LoggerSaver");
const GlobalConfig = require("../../config/GlobalConfig");

// 显示全局配置
const print_globalConfig = new ParamsMapping("pgc", {
    key: "pgconfig",
    count: 0,
    defaults: [],
    description: "显示全局配置"
});

// 注册任务
print_globalConfig.addTask("globalConfig", (params, meta, __this, taskName) =>
{
    const Logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

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
});

module.exports = [print_globalConfig];
