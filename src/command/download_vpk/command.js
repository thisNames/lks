const ParamsMapping = require("../../class/ParamsMapping");

// 打印所有配置
const printOptions = new ParamsMapping("opt", {
    key: "option",
    count: 0,
    defaults: [],
    description: "打印所有配置",
    before: true,
});

// 设置 api
const setApi = new ParamsMapping("api", {
    key: "api",
    count: 1,
    defaults: ["steam"],
    description: "设置下载（免费的）Steam 创意工坊的文件使用的 API [Steam/SteamIO]",
    before: true
});

// 下载（免费的）Steam 创意工坊的文件
const downloadFreeVpk = new ParamsMapping("dv", {
    key: "dlvpk",
    count: -1,
    defaults: [],
    description: "下载（免费的）Steam 创意工坊的文件",
    example: "example/params_download_steam_vpk.txt",
    children: [setApi, printOptions]
});

// 注册任务
downloadFreeVpk.addTask("downloadFreeVpk", (...args) =>
{
    require("./index")(...args);
});

// 子命令
setApi.addTask("downloadFreeVpk.setApi", (params, meta, __this) =>
{
    require("./lib/set_options").setApi(params[0]);
});

printOptions.addTask("downloadFreeVpk.printOptions", (...args) =>
{
    require("./lib/print_option")(...args);
});

module.exports = [downloadFreeVpk];
