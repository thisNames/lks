const ParamsMapping = require("../../class/ParamsMapping");
const LoggerSaver = require("../../class/LoggerSaver");
const Logger = require("../../class/Logger");

// 设置累计加法的长度
const setCount = new ParamsMapping("ct", {
    key: "count",
    count: 1,
    defaults: [3],
    description: "设置累计加法的参数长度（测试命令）",
    example: "example/params_test_set_add.txt",
    before: true,
    accordingLevelRepeat: false
});

// 累计加法
const addition = new ParamsMapping("add", {
    key: "addition",
    count: 2,
    defaults: [10, 20],
    description: "累计加法（测试命令）",
    example: "example/params_test_set_add.txt",
    children: [setCount],
    before: false
});

// 注册任务
addition.addTask("addition", (params, meta, __this, taskName) =>
{
    const Logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    let sum = 0;
    for (let index = 0; index < params.length; index++)
    {
        let element = Number.parseInt(params[index]);
        sum += Number.isNaN(element) ? 0 : element;
    }

    Logger.prompt(`Sum of parameters: ${sum}`).close();

    return sum;
});

// 子命令
setCount.addTask("addition.setCount", (params, meta, __this) =>
{
    let _count = Number.parseInt(params[0]);
    let count = Number.isFinite(_count) ? _count : __this.defaults[0];

    __this.parent.count = count;

    if (count > 0)
    {
        __this.parent.defaults = new Array(count).fill(0);
    }

    return count;
});

// addListenerTasksAfter 和 addListenerAllTasksAfter
addition.addListenerTasksAfter("addition", (result, meta, taskName) =>
{
    Logger.warn("addition.addListenerTasksAfter:");
    Logger.info(`taskName: ${taskName}`);
    Logger.info(`-addition (result): ${result}`);
    Logger.info("===============================");
});

addition.addListenerAllTasksAfter("addition", (result, meta, taskName) =>
{
    Logger.warn("addListenerAllTasksAfter:");
    Logger.info(`taskName: ${taskName}`);
    Logger.info(`-addition (result): ${result}`);
    Logger.info("===============================");
});

setCount.addListenerTasksAfter("addition.setCount", (result, meta, taskName) =>
{
    Logger.warn("addListenerTasksAfter:");
    Logger.info(`taskName: ${taskName}`);
    Logger.info(`-addition-count (result): ${result}`);
    Logger.info("===============================");
});

setCount.addListenerAllTasksAfter("addition.setCount", (result, meta, taskName) =>
{
    Logger.warn("addListenerAllTasksAfter:");
    Logger.info(`taskName: ${taskName}`);
    Logger.info(`-addition-count (result): ${result}`);
    Logger.info("===============================");
});

module.exports = [addition];

