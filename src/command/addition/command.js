const ParamsMapping = require("../../class/ParamsMapping");
const LoggerSaver = require("../../class/LoggerSaver");

// 设置累计加法的长度
const setCount = new ParamsMapping("c", {
    key: "count",
    count: 1,
    defaults: [3],
    description: "设置累计加法的参数长度（测试命令）",
    example: "example/params_test_set_add.txt",
    before: true
});

// 累计加法
const addition = new ParamsMapping("a", {
    key: "addition",
    count: 2,
    defaults: [10, 20],
    description: "累计加法（测试命令）",
    example: "example/params_test_set_add.txt",
    children: [setCount],
    before: true
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

module.exports = [addition];

