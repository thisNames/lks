const ParamsMapping = require("../../class/ParamsMapping");

const collect_required = new ParamsMapping("-crd", {
    key: "--collect-required",
    description: "收集当前项目依赖（开发命令）",
    count: 0,
    defaults: [],
    example: ""
}).addTask("collect_required", (params, meta, __this) => require("./index")(params, meta, __this));

module.exports = [collect_required];
