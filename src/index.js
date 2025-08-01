/**
 *  src 入口文件
 *  @version 0.0.2
 */

const { PARAMS_MAP, SINGLE_MAP, PARAMS_KEY_MAP } = require("./command"); // 命令表

// class
const Logger = require("./class/Logger");
const FormatNumber = require("./class/FormatNumber");

//#region 初始化常量
const START_TIME = Date.now();
//#endregion

// 程序结束
process.addListener("exit", () =>
{
    const fn = new FormatNumber(Date.now() - START_TIME, 1000, ["ms", "s", "m", "h"]);
    let time = fn.formatNumber(4);

    Logger.info(`\r\nrunning time is ${time.value + time.type}`);
});

module.exports = {
    PARAMS_MAP,
    SINGLE_MAP,
    PARAMS_KEY_MAP
};
