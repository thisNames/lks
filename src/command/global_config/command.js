const ParamsMapping = require("../../class/ParamsMapping");
const GlobalConfig = require("../../config/GlobalConfig");
const Tools = require("../../class/Tools");

const set_recursion = new ParamsMapping("rec", {
    key: "recursion",
    count: 1,
    defaults: [GlobalConfig.recursionDeep],
    description: "设置递归最大深度",
    example: "example/params_set_recursion.txt",
    before: true
});

const set_collect_files = new ParamsMapping("cf", {
    key: "cfiles",
    count: 1,
    defaults: [GlobalConfig.collectFileMaxCount],
    description: "设置文件收集最大数量，小于 1 则不做限制",
    example: "example/params_set_collect_file_max.txt",
    before: true
});

const print_global_config = new ParamsMapping("gc", {
    key: "gconfig",
    count: 0,
    defaults: [],
    description: "显示全局配置",
    children: [set_collect_files, set_recursion]
});

print_global_config.addTask("print_global_config", (params, meta) => require("./print_config")(params, meta));

set_collect_files.addTask("set_collect_files", (params, meta) =>
{
    let value = Tools.typeInt(params[0], GlobalConfig.collectFileMaxCount);
    GlobalConfig.collectFileMaxCount = value;
});

set_recursion.addTask("set_recursion", (params, meta) =>
{
    let value = Tools.typeInt(params[0], GlobalConfig.recursionDeep);
    GlobalConfig.recursionDeep = value;
});

module.exports = [print_global_config];
