const ParamsMapping = require("../../class/ParamsMapping");

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
    description: "设置下载（免费的）Steam 创意工坊的文件使用的 API [steam/steamio]",
    example: "",
    before: true
}).addTask("set_option_download_steam_vpk", (params, meta, __this) =>
{
    if (params[0] == "steam") return OPTION.setSteam();
    if (params[0] == "steamio") return OPTION.setSteamIO();
    OPTION.setSteam();
});

module.exports = [download_vpk, set_option];
