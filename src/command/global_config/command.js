const ParamsMapping = require("../../class/ParamsMapping");
const GlobalConfig = require("../../class/GlobalConfig");
const Tools = require("../../class/Tools");

const print_global_config = new ParamsMapping("-pgc", {
    key: "--global-config",
    count: 0,
    defaults: [],
    description: "显示全局配置"
}).addTask("--global-config", (params, meta) => require("./print_config")(params, meta));

const set_recursion = new ParamsMapping("-sr", {
    key: "--set-recursion",
    count: 1,
    defaults: [GlobalConfig.recursionDeep],
    description: "设置递归最大深度"
}).addTask("--set-recursion", (params, meta) =>
{
    let value = Tools.typeInt(params[0], GlobalConfig.recursionDeep);
    GlobalConfig.recursionDeep = value;
});

const set_collect_files = new ParamsMapping("-scf", {
    key: "--set-files",
    count: 1,
    defaults: [GlobalConfig.collectFileMaxCount],
    description: "设置文件收集最大数量，小于 1 则不做限制",
}).addTask("--set-files", (params, meta) =>
{
    let value = Tools.typeInt(params[0], GlobalConfig.collectFileMaxCount);
    GlobalConfig.collectFileMaxCount = value;
});

module.exports = [print_global_config, set_collect_files, set_recursion];
