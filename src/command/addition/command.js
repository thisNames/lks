const ParamsMapping = require("../../class/ParamsMapping");
const LoggerSaver = require("../../class/LoggerSaver");

const addition = new ParamsMapping("-a", {
    key: "--addition",
    count: 2,
    defaults: [0, 0],
    description: "累计加法（测试命令）",
    example: "addition/params_test_add.txt"
}).addTask("--addition", (params, meta) =>
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

const set_addition = new ParamsMapping("-sa", {
    key: "--set-addition",
    count: 1,
    defaults: [2],
    description: "设置累计加法的参数长度（测试命令）",
    example: "addition/params_test_set_add.txt"
});

set_addition.addTask("--set-addition", (params, meta) =>
{
    let _count = Number.parseInt(params[0]);
    let count = Number.isFinite(_count) ? _count : addition.params.defaults[0];

    addition.params.count = count;

    if (count > 0)
    {
        addition.params.defaults = new Array(count).fill(0);
    }

    return count;
});

module.exports = [addition, set_addition];

