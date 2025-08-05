const ParamsMapping = require("../../class/ParamsMapping");

const help = new ParamsMapping("-h", {
    key: "--help",
    count: -1,
    defaults: [],
    description: "显示帮助文档，--help [command1 command2 ...] 可查看指定命令的帮助文档",
    example: "example/help.txt",
    before: true
}).addTask("print_help", (params, meta, __this) => require("./index")(params, meta, __this));

module.exports = [help];
