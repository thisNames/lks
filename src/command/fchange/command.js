const ParamsMapping = require("../../class/ParamsMapping");

// 搜索一个目录名
const fSearchDirectory = new ParamsMapping("s", {
    key: "fsearch",
    count: 1,
    defaults: [0],
    description: "打开目录、修改当前的工作目录。 <name / path>",
    accordingLevelRepeat: false
});

// 显示已经收录的目录列表
const listDirectory = new ParamsMapping("l", {
    key: "list",
    count: 0,
    defaults: [],
    description: "显示已经收录的目录列表",
    accordingLevelRepeat: false
});

// 启用 terminal
const enTerminal = new ParamsMapping("t", {
    key: "ter",
    count: 0,
    defaults: [],
    description: "修改本次运行的工作路径、而不是打开一个 explorer 目录",
    accordingLevelRepeat: false
});

// 删除一个目录，ID
const fDeleteDirectory = new ParamsMapping("d", {
    key: "del",
    count: -1,
    defaults: [],
    description: "使用 ID 删除一个目录 [id1] [id2] [id3~id7]",
    accordingLevelRepeat: false
});

// 添加一个目录路径
const fAddDirectory = new ParamsMapping("a", {
    key: "add",
    count: 2,
    defaults: ["dirname", process.cwd()],
    description: "添加一个目录路径 <name> <path>",
    accordingLevelRepeat: false
});

// 修改当前路径命令
const fChange = new ParamsMapping("fd", {
    key: "fdir",
    count: 1,
    defaults: [0],
    description: "打开目录、修改当前的工作目录。<id / name>",
    children: [fAddDirectory, fDeleteDirectory, enTerminal, listDirectory, fSearchDirectory]
});

// 注册任务
enTerminal.addTask("fchange.enTerminal", (params, meta, __this, taskName) =>
{
    require("./command/set_options").setTerminal(true);
});

listDirectory.addTask("fchange.list", (...args) =>
{
    require("./command/list")(...args);
});

fAddDirectory.addTask("fchange.add", (...args) =>
{
    require("./command/add_dir")(...args);
});

fDeleteDirectory.addTask("fchange.del", (...args) =>
{
    require("./command/delete_dir")(...args);
});

fChange.addTask("fchange", (...args) =>
{
    require("./command/change_dir")(...args);
});

fSearchDirectory.addTask("fchange.search", (...args) =>
{
    require("./command/search_dir")(...args);
});

module.exports = [fChange];
