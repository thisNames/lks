const LoggerSaver = require("../../class/LoggerSaver");

module.exports = function (param, meta, __this)
{
    const { singleMap, cwd } = meta;
    let workerPath = cwd || process.cwd();

    const Logger = new LoggerSaver("Version_Task", workerPath, singleMap.isSaveLog.include);
    let package = require("../../../package.json");
    Logger.info(package.version).close();
}
