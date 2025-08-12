const ParamsMapping = require("../../class/ParamsMapping");

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
    description: "修改当前终端工作路径、或者打开一个目录 => explorer",
    accordingLevelRepeat: false
});

// 删除一个目录，ID
const fDeleteDirectory = new ParamsMapping("d", {
    key: "del",
    count: 1,
    defaults: [null],
    description: "使用 ID 删除一个目录",
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
const fChange = new ParamsMapping("fcg", {
    key: "fchange",
    count: 1,
    defaults: [0],
    description: "打开目录、修改当前的工作目录",
    children: [fAddDirectory, fDeleteDirectory, enTerminal, listDirectory]
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

module.exports = [fChange];
