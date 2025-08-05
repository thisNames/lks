const ParamsMapping = require("../../class/ParamsMapping");

const OPTION = require("./lib/option");

const file_symlink = new ParamsMapping(null, {
    key: "*",
    count: 1,
    defaults: [".vpk"],
    description: "文件创建符号链接，* 为文件所在的路径",
    example: "example/params_file_symlink.txt"
}).addTask("file_symlink", (params, meta, __this) => require("./index")(params, meta, __this));

const set_display_only = new ParamsMapping("-sydy", {
    key: "--symlink-display",
    count: 0,
    defaults: [],
    description: "仅显示收集到的文件集合，不创建符号链接",
    example: "",
    before: true
}).addTask("set_display_only", (params, meta, __this) =>
{
    OPTION.isDisplayOnly = true;
});

module.exports = [file_symlink, set_display_only];
