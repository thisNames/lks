const fs = require("node:fs");

const Executor = require("../../../class/cp/Executor");
const ExecutorResult = require("../../../class/cp/ExecutorResult");

/**
 *  一个目录对象
 */
class DirItem
{
    /**
     *  @param {DirItem} option
     */
    constructor(option)
    {
        const {
            path = "",
            name = ""
        } = option || {};

        /** @type {String} 目录路径 */
        this.path = path;

        /** @type {String} 目录别名 */
        this.name = name;
    }

    /**
     *  打开一个资源管理器，打开的目录为本实例的目录
     *  @returns {String}
     */
    open()
    {
        if (!this.__isExist()) return false;

        const option = {
            "win32": "explorer",
            "darwin": "open",
            "default": "xdg-open"
        };

        const pla = option[process.platform];
        const cmd = pla ? pla : option.default;

        const executer = new Executor({
            exe: cmd,
            params: [this.path]
        });

        executer.executorSync();

        return this.path;
    }

    /**
     *  修改当前终端的工作目录
     *  @returns {String}
     */
    change()
    {
        if (!this.__isExist()) return false;

        process.chdir(this.path);

        return process.cwd();
    }

    /**
     *  判断当前实例是否真的存在
     *  @returns {boolean}
     */
    __isExist()
    {
        if (!fs.existsSync(this.path) || fs.statSync(this.path).isFile()) return false;
        return true;
    }
}

module.exports = DirItem;
