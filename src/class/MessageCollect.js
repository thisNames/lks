const fs = require("node:fs");
const pt = require("node:path");

/**
 *  日志收集类
 */
class MessageCollect
{
    /**
     * @param {String} path 日志保存路径
     * @param {String} name 日志名称，默认 log
     * @param {Number} maxLine  单个日志文件最大行数
     */
    constructor(name, path, maxLine)
    {
        this.currentLine = 0;
        this.fr = null;

        this.name = name;
        this.path = path;
        this.maxLine = maxLine;

        this.initLog();
    }

    /**
     *  初始化日志
     */
    initLog()
    {
        this.currentLine = 0;
        if (!fs.existsSync(this.path))
        {
            this.path = fs.mkdirSync(this.path, { recursive: true });
        }

        this.filename = this.name.concat(MessageCollect.getDate(), "_", Date.now(), ".log");
        this.filePath = pt.resolve(this.path, this.filename);
        this.fr = fs.openSync(this.filePath, "w");
    }


    /**
     *  关闭文件
     *  @param {String} message 消息
     */
    close(message)
    {
        this.collect(this.name, message);
        if (this.fr === null) return;

        try
        {
            fs.closeSync(this.fr);
        }
        catch (r)
        {

        }
    }

    /**
     *  获取日期
     */
    static getDate()
    {
        const d = new Date();
        return "".concat(d.getFullYear(), "-", d.getMonth() + 1, "-", d.getDate());
    }

    /**
     *  获取实时时间
     */
    static getDateTime()
    {
        const date = new Date();
        const datetime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        return datetime;
    }

    /**
     * 消息收集
     * @param {String} you 你是谁
     * @param {String} message 要说什么
     * @param {Boolean} print 是否输出到控制台
     */
    collect(you, message, print)
    {
        const m = `[${MessageCollect.getDateTime()}] ${you}: ${message}`;
        print && console.log(m);
        try
        {
            this.currentLine++;
            if (!fs.existsSync(this.filePath) || this.currentLine > this.maxLine)
            {
                fs.closeSync(this.fr);
                this.initLog();
                return;
            }
            fs.writeFileSync(this.fr, m.concat("\r\n"), { encoding: "utf-8" });
        }
        catch (r)
        {

        }
    }
}

module.exports = MessageCollect;
