const fs = require("node:fs");
const pt = require("node:path");

const { getDate, getRealTime } = require("./Tools");
/**
 *  日志收集类
 */
class MessageCollect
{
    /**
     * @param {String} path 日志保存路径
     * @param {String} name 日志名称，默认 log
     */
    constructor(name, path)
    {
        this.fr = null;
        this.name = name;
        this.path = path;

        this.init();
    }

    /**
     *  初始化日志
     *  @returns {MessageCollect} this
     */
    init()
    {
        if (!fs.existsSync(this.path))
        {
            this.path = fs.mkdirSync(this.path, { recursive: true });
        }

        this.filename = this.name.concat("_", getDate(), "_", Date.now(), ".log");
        this.filePath = pt.resolve(this.path, this.filename);
        this.fr = fs.openSync(this.filePath, "w");

        return this;
    }


    /**
     *  关闭文件
     *  @returns {MessageCollect} this
     */
    close()
    {
        if (this.fr === null) return this;

        fs.closeSync(this.fr);
        this.fr = null;

        return this;
    }

    /**
     * 消息收集
     * @param {String} you 你是谁
     * @param {String} message 要说什么
     * @returns {MessageCollect} this
     */
    collect(you, message)
    {
        const m = `[${getRealTime()}] ${you}: ${message}\r\n`;

        try
        {
            fs.writeSync(this.fr, m, null, "utf-8");
        } catch (error)
        {
            this.close();
        }

        return this;
    }
}

module.exports = MessageCollect;
