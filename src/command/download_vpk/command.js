const ParamsMapping = require("../../class/ParamsMapping");
const Tools = require("../../class/Tools");

const OPTION = require("./lib/option");

const download_vpk = new ParamsMapping("-dv", {
    key: "--downloads-vpk",
    count: -1,
    defaults: [],
    description: "下载（免费的）Steam 创意工坊的文件",
    example: "example/params_download_steam_vpk.txt"
}).addTask("download_steam_vpk", (params, meta, __this) => require("./index")(params, meta, __this));

const set_option = new ParamsMapping("-dvapi", {
    key: "--set-downloads-vpk-api",
    count: 1,
    defaults: ["steam"],
    description: "设置下载（免费的）Steam 创意工坊的文件使用的 API [Steam/SteamIO]",
    example: "",
    before: true
}).addTask("set_option_download_steam_vpk", (params, meta, __this) =>
{
    if (Tools.equalString(params[0], "Steam", true)) return OPTION.setSteam();
    if (Tools.equalString(params[0], "SteamIO", true)) return OPTION.setSteamIO();
    OPTION.setSteam();
});

module.exports = [download_vpk, set_option];
