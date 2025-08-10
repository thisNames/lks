const ParamsMapping = require("../../class/ParamsMapping");

const OPTION = require("./lib/option");

const set_display = new ParamsMapping("dis", {
    key: "display",
    count: 0,
    defaults: [],
    description: "仅显示收集到的文件集合，不创建符号链接",
    example: "",
    before: true,
    linkSymbol: "-",
    accordingLevelRepeat: true,
    parentPrefix: false
});

const file_symlink = new ParamsMapping("*", {
    key: "*",
    count: 1,
    defaults: [".vpk"],
    description: "文件创建符号链接，* 为文件所在的路径",
    example: "example/params_file_symlink.txt",
    children: [set_display],
    linkSymbol: "",
    accordingLevelRepeat: false,
    parentPrefix: false
})

file_symlink.addTask("file_symlink", (params, meta, __this) => require("./index")(params, meta, __this));

set_display.addTask("set_display", (params, meta, __this) =>
{
    OPTION.isDisplayOnly = true;
});

module.exports = [file_symlink];
