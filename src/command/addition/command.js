const ParamsMapping = require("../../class/ParamsMapping");
const LoggerSaver = require("../../class/LoggerSaver");

const set_count = new ParamsMapping("c", {
    key: "count",
    count: 1,
    defaults: [3],
    description: "设置累计加法的参数长度（测试命令）",
    example: "example/params_test_set_add.txt",
    before: true
});

const addition = new ParamsMapping("a", {
    key: "addition",
    count: 2,
    defaults: [0, 0],
    description: "累计加法（测试命令）",
    example: "example/params_test_set_add.txt",
    children: [set_count]
});

addition.addTask("addition", (params, meta, __this) =>
{
    const { singleMap, cwd } = meta;
    const workerPath = cwd || process.cwd();

    const Logger = new LoggerSaver("Addition_Task", workerPath, singleMap.isSaveLog.include);

    let sum = 0;
    for (let index = 0; index < params.length; index++)
    {
        let element = Number.parseInt(params[index]);
        sum += Number.isNaN(element) ? 0 : element;
    }

    Logger.prompt(`Sum of parameters: ${sum}`).close();

    return sum;
});

set_count.addTask("set_count", (params, meta, __this) =>
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

