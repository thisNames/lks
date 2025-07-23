const { execSync } = require('child_process');
const os = require('os');

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
     *  @param {Params} pm 参数命令对象
     *  @param {Boolean} isUseDefaultValueKey 是否使用默认参数
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
     *  @param {...*} args 文字
     *  @returns {String}
     */
    static comment(...args)
    {
        return args.join("\r\n\t");
    }


    /**
     *  判断是否是管理员权限运行命令
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
     *  @param {String} value 参数字符串
     *  @param {Number} defaultValue 转换失败，使用此默认值
     *  @returns {Number}
     */
    static typeInt(value, defaultValue)
    {
        let _value = Number.parseInt(value);
        return Number.isNaN(_value) ? defaultValue : _value;
    }

    /**
      *  获取日期
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
     *  @param {String} split 分隔符 -
     *  @returns {String}
     */
    static getRealTime(split = "-")
    {
        const date = new Date();
        const datetime = date.toLocaleDateString() + split + date.toLocaleTimeString();
        return datetime;
    }
}

module.exports = Tools;
