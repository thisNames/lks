const Single = require("../class/Single");

class GlobalSingle
{
    constructor()
    {
        /** @type {Single} 占位符，表示使用默认参数（前提是有） */
        this.dvp = new Single("$D", "占位符，表示使用默认参数（前提是有）", "example/dvp.txt", __filename);

        /** @type {Single} 启用递归 */
        this.isRecursion = new Single("-R", "启用递归", "", __filename);

        /** @type {Single} 为本次操作保存日志 */
        this.isSaveLog = new Single("-L", "为本次操作保存日志", "", __filename);
    }
}

module.exports = GlobalSingle;
