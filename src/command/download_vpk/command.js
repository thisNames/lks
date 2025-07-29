const ParamsMapping = require("../../class/ParamsMapping");

const download_vpk = new ParamsMapping("-dv", {
    key: "--download-vpk",
    count: -1,
    defaults: [],
    description: "下载（免费的）Steam 创意工坊的文件",
    example: "params_download_steam_vpk.txt"
});

module.exports = [download_vpk];
