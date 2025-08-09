const ParamsMapping = require("../../class/ParamsMapping");

const version = new ParamsMapping("v", {
    key: "version",
    count: 0,
    defaults: [],
    description: "显示当前版本"
}).addTask("print_version", (params, meta, __this) => require("./index")(params, meta, __this));


module.exports = [version];
