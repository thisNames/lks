/**
 *  打印帮助
 */
const Logger = require("../../class/Logger");

module.exports = function (params, meta)
{
    let { PMG, SM } = meta;

    // 参数命令
    for (let key in PMG)
    {
        let pmgOption = PMG[key];

        let mapKey = pmgOption.mapKey || "";

        let { key: paramKey, description, defaults, count } = pmgOption.params;

        Logger.info("".concat(mapKey, "  ", paramKey));
        Logger.info("\t".concat(description));

        if (count > 0)
        {
            Logger.info("\t".concat("默认参数个数：", count));
            Logger.info("\t默认参数：".concat(defaults.join(", ")));
        }
    }

    Logger.info("----------");

    // 布尔命令
    for (let key in SM)
    {
        let smOption = SM[key];
        let { key: singleKey, description } = smOption;
        Logger.info(singleKey);
        Logger.info("\t".concat(description));
    }

    Logger.info("----------");

    // 仓库
    const package = require("../../../package.json");
    Logger.info("获取更多：");
    package.repositorys.forEach(item => Logger.info(`\t${item.url}（${item.type}）`));
}
