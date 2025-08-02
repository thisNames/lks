const ParamsMapping = require("../../class/ParamsMapping");

const build_project = new ParamsMapping("-bpt", {
    key: "--build-project",
    description: "打包当前项目（开发命令）",
    count: 0,
    defaults: [],
    example: ""
}).addTask("build_project", (params, meta, __this) => require("./index")(params, meta, __this));

module.exports = [build_project];
