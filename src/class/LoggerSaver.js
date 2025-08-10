const Logger = require("./Logger");
const MessageCollect = require("./MessageCollect");

/**
 *  日志保存类
 *  @version 0.0.4
 */
class LoggerSaver
{
    /**
     *  @param {String} filename 日志文件名
     *  @param {String} saveFolder 日志文件保存目录
     *  @param {Boolean} isSave 是否保存日志
     */
    constructor(filename, saveFolder, isSave)
    {
        this.saveFolder = saveFolder;
        this.filename = filename;
        this.isSave = isSave;

        /** @type {MessageCollect} */
        this.__logFile = null;

        if (this.isSave)
        {
            this.__logFile = new MessageCollect(this.filename, this.saveFolder);
        }
    }
    /**
     *  关闭日志文件
     */
    close()
    {
        if (this.__logFile)
        {
            this.__logFile.close();
        }
    }

    /** 工具方法 */
    __log(color, ...args)
    {
        let message = args.map(s =>
        {
            if (typeof s === "string") return s;
            if (typeof s === "object") return JSON.stringify(s);
            if (typeof s === "function") return s.toString();
            return String(s);
        }).join(" ");

        // 如果启用保存日志
        if (this.__logFile)
        {
            // 保存日志
            this.__logFile.collect(this.filename, message);
        }

        console.log(`${color}${message}${Logger.RESET}`);

        return this;
    }

    /** 信息 */
    info(...args)
    {
        return this.__log(Logger.RESET, ...args);
    }

    /** 成功 */
    success(...args)
    {
        return this.__log(Logger.GREEN, ...args);
    }

    /** 警告 */
    warn(...args)
    {
        return this.__log(Logger.YELLOW, ...args);
    }

    /** 错误 */
    error(...args)
    {
        return this.__log(Logger.RED, ...args);
    }

    /** 提示 */
    prompt(...args)
    {
        return this.__log(Logger.CYAN, ...args);
    }

    /** 指点 */
    tip(...args)
    {
        return this.__log(Logger.LIGHT_BLUE, ...args);
    }

    /** 空一行 */
    line()
    {
        return this.__log(Logger.RESET);
    }

}

module.exports = LoggerSaver;
