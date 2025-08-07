const cp = require("node:child_process");

const ExecutorResult = require("./ExecutorResult");

/**
 * 执行类
 * @version 0.0.1
 */
class Executor
{
    /**
     * @param {String} exe 程序路径
     * @param {String} workSpace 子进程的当前工作目录
     */
    constructor(exe, workSpace = process.cwd())
    {
        /** @type {String} 程序路径 */
        this.__exe = this.a_content_b(exe);

        /** @type {String} 子进程的当前工作目录 */
        this.__workSpace = this.a_content_b(workSpace);

        /** @type {String} 子进程的运行参数 */
        this.__params = "";
    }

    /**
     *  设置子进程运行参数
     *  @param {...String} args 参数
     *  @returns {Executor} this
     */
    setParams(...args)
    {
        this.__params = args.map(arg => this.a_content_b(arg)).join(" ");
        return this;
    }

    /**
     * 执行程序（同步）
     * @returns {ExecutorResult}
     */
    executorSync()
    {
        const ert = new ExecutorResult(this.__exe, this.__params);

        try
        {
            const stdout = cp.execSync(this.__exe, {
                cwd: this.__workSpace,
                encoding: "utf-8",
                input: this.__params
            });

            ert.done = true;
            ert.stdout = stdout;
        } catch (error)
        {
            ert.done = false;
            ert.error = `${this.__exe} => ${error.message || "sync executor error"}`;
        }

        return ert;
    }

    /**
    * 执行程序（异步）
    * @returns {Promise<ExecutorResult>}
    */
    executor()
    {
        return new Promise((res, rej) =>
        {
            const ert = new ExecutorResult(this.__exe, this.__params);

            const p = cp.exec(this.__exe, { cwd: this.__workSpace, encoding: "utf-8", input: this.__params }, (err, stdout) =>
            {
                if (err)
                {
                    ert.error = `${this.__exe} => ${err.message || "executor error"}`;
                }

                ert.done = !err;
                ert.stdout = stdout;

                res(ert);
            });

            ert.pid = p.pid;
            ert.exitCode = p.exitCode;
        });
    }

    /**
     * 给字符串添加左右内容包裹
     * @param {String} content 内容
     * @param {String} a 左追加
     * @param {String} b 右追加
     * @returns 
     */
    a_content_b(content, a = "\"", b = "\"")
    {
        return "".concat(a, content, b);
    }
}

module.exports = Executor;
