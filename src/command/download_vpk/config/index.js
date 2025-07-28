const LoggerSaver = require("../../../class/LoggerSaver");

/**
 *  获取配置文件
 *  @param {String} json JSON 版本的配置（主配置）
 *  @param {String} javascript JavaScript 版本的配置（默认配置）
 *  @description 该函数会尝试加载 JSON 配置文件，如果失败则加载 hJavaScript 配置文件
 *  @returns {Object} 配置对象
 */
function loaderConfigForJsonOrJavaScript(json, javascript)
{
    let data = null;

    try
    {
        data = require(json);
    } catch (error)
    {
        // 使用默认的文件
        data = require(javascript);
    }

    return data;
}

/**
 *  设置请求头
 *  @param {Object} headers 请求头对象
 *  @param {String} key 键
 *  @param {String} value 值
 *  @description 如果键已存在，则更新其值；如果不存在，则添加新的键和值
 */
function setHeaders(headers, key, value)
{
    if (Reflect.has(headers, key))
    {
        Reflect.set(headers, key, value);
    }
    else
    {
        Reflect.defineProperty(headers, key, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
}

/**
 * 删除请求头
 * @param {Object} headers 请求头对象
 * @param {String} key 键
 * @returns {Boolean} 是否成功删除 
 */
function deleteHeaders(headers, key)
{
    if (Reflect.has(headers, key))
    {
        Reflect.deleteProperty(headers, key);

        return true;
    }

    return false;
}

/**
 *  打印请求头
 *  @param {Object} headers 请求头对象
 *  @param {LoggerSaver} Logger 日志记录器
 *  @description 该函数会遍历请求头对象，并打印每个键值对
 */
function printHeaders(headers, Logger)
{
    for (const key in headers)
    {
        if (Object.prototype.hasOwnProperty.call(headers, key))
        {
            const value = headers[key];
            Logger.info(`${key} = ${value}`);
        }
    }
}

module.exports = {
    loaderConfigForJsonOrJavaScript,
    setHeaders,
    deleteHeaders,
    printHeaders
};

