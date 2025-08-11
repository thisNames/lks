const ParamsMapping = require("../../class/ParamsMapping");

const template = {
    linkSymbol: "-",
    accordingLevelRepeat: true,
    parentPrefix: false,
    before: true
}

/** 打印所有配置 */
const printOptions = new ParamsMapping("fop", {
    key: "fsoption",
    count: 0,
    defaults: [],
    description: "打印所有配置",
    ...template
});

/** 只显示文件，不创建符号链接 */
const enDisplay = new ParamsMapping("dis", {
    key: "display",
    count: 0,
    defaults: [],
    description: "仅显示收集到的文件集合，不创建符号链接",
    ...template
});

/** 启用递归擦查找文件 */
const enRecursion = new ParamsMapping("er", {
    key: "enrecursion",
    count: 0,
    defaults: [],
    description: "开启递归",
    ...template
});

/** 设置递归最大深度 */
const setRecursionDeep = new ParamsMapping("rd", {
    key: "recursion",
    count: 1,
    defaults: [10],
    description: "设置递归最大深度",
    ...template
});

/** 设置收集的最大文件数 */
const setMaxFile = new ParamsMapping("mf", {
    key: "maxfile",
    count: 1,
    defaults: [1000],
    description: "设置文件收集最大数量，小于 1 则不做限制",
    ...template
});

/** 主命令：批量创建符号链接 */
const fileSymlink = new ParamsMapping("*", {
    key: "*",
    count: 1,
    defaults: [".vpk"],
    description: "文件创建符号链接，* 为文件所在的路径",
    example: "example/params_file_symlink.txt",
    linkSymbol: "",
    accordingLevelRepeat: false,
    parentPrefix: false,
    children: [enDisplay, enRecursion, setMaxFile, setRecursionDeep, printOptions]
});

// 注册任务
fileSymlink.addTask("fileSymlink", (...args) =>
{
    require("./index")(...args);
});

// 子命令
printOptions.addTask("fileSymlink.options", (...args) =>
{
    require("./lib/print_options")(...args);
});

enDisplay.addTask("fileSymlink.enDisplay", () =>
{
    require("./lib/set_options").setDisplayOnly(true);
});

enRecursion.addTask("fileSymlink.enRecursion", () =>
{
    require("./lib/set_options").setRecursion(true);
});

setMaxFile.addTask("fileSymlink.setMaxFile", (params) =>
{
    require("./lib/set_options").setCollectFileMaxCount(params[0])
});

setRecursionDeep.addTask("fileSymlink.setRecursionDeep", (params) =>
{
    require("./lib/set_options").setRecursionDeep(params[0]);
});

module.exports = [fileSymlink];
