const ParamsMapping = require("../../class/ParamsMapping");

const file_symlink = new ParamsMapping(null, {
    key: "*",
    count: 1,
    defaults: [".vpk"],
    description: "文件创建符号链接，* 为文件所在的路径",
    example: "params_file_symlink.txt",
    index: -1,
}).addTask("file_symlink", (params, meta, __this) => require("./index")(params, meta, __this));

module.exports = [file_symlink];
