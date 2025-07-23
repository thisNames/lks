/**
 *  打印类
 */
class Logger
{
    /** 统一的样式重置符 白色 */
    static RESET = '\x1b[0m';
    /** 绿色 */
    static GREEN = '\x1b[32m';
    /** 黄色 */
    static YELLOW = '\x1b[33m';
    /** 红色 */
    static RED = '\x1b[31m';

    /** 蓝色 */
    static BLUE = '\x1b[34m';
    /** 紫色 */
    static MAGENTA = '\x1b[35m';
    /** 青色 */
    static CYAN = '\x1b[36m';
    /** 灰色 */
    static GRAY = '\x1b[90m';

    /** 工具方法 */
    static log(color, ...args) { console.log(color, ...args, Logger.RESET); }

    /** 信息 */
    static info(...args) { Logger.log(Logger.RESET, ...args); }
    /** 成功 */
    static success(...args) { Logger.log(Logger.GREEN, ...args); }
    /** 警告 */
    static warn(...args) { Logger.log(Logger.YELLOW, ...args); }
    /** 错误 */
    static error(...args) { Logger.log(Logger.RED, ...args); }
}

module.exports = Logger;
