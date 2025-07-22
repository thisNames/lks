/**
 *  打印帮助
 */
module.exports = function (params, meta)
{
    let { PMG, SM } = meta;

    // 参数命令
    for (let key in PMG)
    {
        let pmgOption = PMG[key];

        let mapKey = pmgOption.mapKey || "";

        let { key: paramKey, description, defaults, count } = pmgOption.params;

        console.log("".concat(mapKey, "  ", paramKey));
        console.log("\t".concat(description));

        if (count > 0)
        {
            console.log("\t".concat("默认参数个数：", count));
            console.log("\t默认参数：".concat(defaults.join(", ")));
        }
    }

    console.log("----------");

    // 布尔命令
    for (let key in SM)
    {
        let smOption = SM[key];
        let { key: singleKey, description } = smOption;
        console.log(singleKey);
        console.log("\t".concat(description));
    }

    console.log("----------");

    // 仓库
    const package = require("../../../package.json");
    console.log("获取更多：");
    package.repositorys.forEach(item => console.log(`\t${item.url}（${item.type}）`));
}
