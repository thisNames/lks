const { execSync } = require("node:child_process");
const os = require("node:os");
const readline = require("node:readline");
const crypto = require('node:crypto');

const Params = require("./Params");

/**
 *  工具类
 */
class Tools
{
    constructor()
    {

    }

    /**
     *  填充指令参数
     *  @version 0.0.1
     *  @param {Params} pm 参数命令对象
     *  @param {String} isUseDefaultValueKey 是否使用默认参数
     *  @returns {Params} 参数命令对象
     */
    static fillParams(pm, isUseDefaultValueKey)
    {
        // 如果值为小于0，那么后面的参数都将作为 params 的参数，defaults 参数将不会生效
        if (pm.count < 0)
        {
            while (process.argv.length > 0)
            {
                let pv = process.argv.shift();
                pm.params.push(pv);
            }
            return pm;
        }

        // 填充参数
        for (let i = 0; i < pm.count; i++)
        {
            if (process.argv.length < 1)
            {
                // 使用默认参数
                pm.params.push(pm.defaults[i]);
                continue;
            }
            // 使用命令参数
            let pv = process.argv.shift();
            pm.params.push(pv == isUseDefaultValueKey ? pm.defaults[i] : pv);
        }

        return pm;
    }

    /**
     *  生成文字注释
     *  @version 0.0.1
     *  @param {...*} args 文字
     *  @returns {String}
     */
    static comment(...args)
    {
        return args.join("\r\n\t");
    }


    /**
     *  判断是否是管理员权限运行命令
     *  @version 0.0.1
     *  @returns {Boolean} 是 true 或者不是 false
     */
    static isAdministrator()
    {
        const platform = os.platform();

        try
        {
            if (platform === "win32")
            {
                // Windows: 使用 'net session' 检查管理员权限
                execSync("net session", { stdio: "ignore" });
                return true;
            } else
            {
                // Unix/Linux/macOS: 检查 UID 是否为 0（root）
                return process.getuid && process.getuid() === 0;
            }
        } catch (error)
        {
            // 如果命令执行失败（如权限不足），返回 false
            return false;
        }
    }

    /**
     *  转换整数
     *  @version 0.0.1
     *  @param {String} value 参数字符串
     *  @param {Number} defaultValue 转换失败，使用此默认值
     *  @returns {Number}
     */
    static typeInt(value, defaultValue)
    {
        let _value = Number.parseInt(value);
        return Number.isFinite(_value) ? _value : defaultValue;
    }

    /**
     *  获取日期
     *  @version 0.0.1
     *  @param {String} split 分隔符 -
     *  @returns {String}
     */
    static getDate(split = "-")
    {
        const d = new Date();
        return "".concat(d.getFullYear(), split, d.getMonth() + 1, split, d.getDate());
    }

    /**
     *  获取实时日期时间
     *  @version 0.0.1
     *  @param {String} split 分隔符 -
     *  @returns {String}
     */
    static getRealTime(split = "-")
    {
        const date = new Date();
        const datetime = date.toLocaleDateString() + split + date.toLocaleTimeString();
        return datetime;
    }

    /**
     *  将字节(byte)转换为最合适的单位（KB、MB、GB）
     *  @version 0.0.1
     *  @param {number} bytes 字节数
     *  @returns {{value: number, type: 'KB' | 'MB' | 'GB'}}
     */
    static formatBytes(bytes)
    {
        if (typeof bytes !== 'number' || bytes < 0) throw new TypeError('bytes 必须为非负数字');

        const KB = 1024;
        const MB = KB * 1024;
        const GB = MB * 1024;

        let value, type;

        if (bytes < KB)
        {
            value = bytes;
            type = 'B';
        } else if (bytes < MB)
        {
            value = bytes / KB;
            type = 'KB';
        } else if (bytes < GB)
        {
            value = bytes / MB;
            type = 'MB';
        } else
        {
            value = bytes / GB;
            type = 'GB';
        }

        // 保留两位小数
        value = parseFloat(value.toFixed(2));

        return { value, type };
    }

    /**
     *  获取控制台输入
     *  @version 0.0.2
     *  @returns {Promise<String>}
     */
    static terminalInput()
    {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        rl.prompt(true);

        return new Promise((res, rej) =>
        {
            // 监听第一行输入
            rl.once("line", input =>
            {
                res(input.trim());
                rl.close();
            });
            rl.on("close", () => rej(""));
        });
    }

    /**
     * 将字符串中的非法文件夹名字符剔除
     * @version 0.0.1
     * @param {String} [defaultName="untitled"] 如果结果为空，给个默认名字
     * @param {string} str 原始字符串
     * @returns {string}   可用于新建文件夹的安全名称
     */
    static sanitizeFolderName(str, defaultName = "untitled")
    {
        if (typeof str !== 'string') return '';

        // 1. 定义非法字符集合（Windows + POSIX）
        //   Windows: <>:"/\|?*
        //   Linux/macOS: 主要是 '/' 和 '\0'，但为统一体验，也去掉 <>:|?*"
        const illegalChars = /[<>:"/\\|?*\x00-\x1f]/g;

        // 2. 去掉非法字符、首尾空格/句点
        let safe = str.replace(illegalChars, '').trim().replace(/^\.+|\.+$/g, ''); // 去掉首尾连续的句点

        // 3. 处理 Windows 保留名称（CON, PRN, AUX, NUL, COM1..9, LPT1..9 等）
        const reserved = /^(CON|PRN|AUX|NUL|COM\d|LPT\d)(\.|$)/i;
        if (reserved.test(safe))
        {
            safe = safe.replace(/^(.+)/, '_$1'); // 前面加下划线
        }

        // 4. 如果结果为空，给个默认名字
        if (!safe) safe = defaultName;

        return safe;
    }

    /**
     *  判断是合法的 url
     *  @version 0.0.1
     *  @param {String} url exp: https:127.0.0.1
     *  @returns {URL | null}
     */
    static validURL(url)
    {
        try
        {
            const origin = new URL(url);
            return origin;
        } catch (error)
        {
            return null;
        }
    }

    /**
     *  生成指定长度的哈希字符串 ID
     *  @version 0.0.1
     *  @param {Number} length 哈希字符串的长度
     *  @returns {String} 生成的哈希字符串
     */
    static generateHashId(length)
    {
        if (!Number.isInteger(length) || length <= 0)
        {
            length = 5;
        }

        const buffer = crypto.randomBytes((length + 1) >> 1); // 使用位运算优化 Math.ceil
        return buffer.toString('hex').substring(0, length); // substring 性能略优于 slice
    }
}

module.exports = Tools;
