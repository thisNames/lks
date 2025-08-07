/**
 *  子进程执行结果类
 *  @version 0.0.1
 */
class ExecutorResult
{
    /**
     *  @param {String} exe 子进程路径 | 命令的名称
     *  @param {String} params 执行参数
     */
    constructor(exe, params)
    {
        /** @type {String} 子进程路径 | 命令的名称 */
        this.exe = exe || "";

        /** @type {String} 子进程执行参数 */
        this.params = params || "";

        /** @type {String} 子进程执行的标准输出 */
        this.stdout = "";

        /** @type {String} 子进程执行的错误信息 */
        this.error = "";

        /** @type {Boolean} 是否执行成功 */
        this.done = false;

        /** @type {Number} 子进程的 pid */
        this.pid = null;
    }
}

module.exports = ExecutorResult;
