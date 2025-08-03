const fs = require("node:fs");
const pt = require("node:path");

const Params = require("../../class/Params");
const MainRunningMeta = require("../../class/MainRunningMeta");
const LoggerSaver = require("../../class/LoggerSaver");

/**
 *  @param {Array<String>} collects 需要收集的依赖名称
 *  @param {LoggerSaver} Logger 日志记录器
 */
async function collectModules(collects, Logger)
{
    /** @type {Array<fs.Dirent>} 一个模块所包含项 */
    let modules = [];

    /** @type {Array<Promise<fs.Dirent>>} 一个模块所包含项 */
    let dirent = [];

    for (let i = 0; i < collects.length; i++)
    {
        const item = collects[i];

        if (!fs.existsSync(item) || fs.statSync(item).isFile())
        {
            Logger.warn(`收集错误: 没有找到 ${item} 文件夹`);
            continue;
        }

        let dir = new Promise((resolve, reject) =>
        {
            try
            {
                fs.readdir(item, { withFileTypes: true, encoding: "utf-8", recursive: true }, (error, dirent) =>
                {
                    if (!error) return resolve(dirent);
                    Logger.warn(error.message);
                    resolve([]);
                });
            } catch (error)
            {
                Logger.warn(error.message);
            }
        });

        dirent.push(dir);
    }

    modules = await Promise.all(dirent);

    console.log(modules);

}

/**
 *  @param {String} dirname 模块路径
 *  @param {Object} package 依赖配置
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {Array<String>}
 */
function collectsRequired(dirname, packages, Logger)
{
    dirname = dirname + "";
    const collects = [];
    const package = packages?.packages;

    if (typeof package != "object" || !package) return collects;

    for (const key in package)
    {
        if (Object.prototype.hasOwnProperty.call(package, key))
        {
            const item = Reflect.get(package, key);

            if (typeof item != "object" || !item) continue;
            if (key === "" || item.dev) continue;

            let path = pt.join(dirname + "", key);
            collects.push(path);
            Logger.info(`required: ${path}`);
        }
    }

    return collects;
}

/**
 *  @param {String} dirname 模块路径
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {object}
 */
function getPackage(dirname, Logger)
{
    dirname = dirname + "";
    const dotPackageLockPath = pt.join(dirname, "node_modules", ".package-lock.json");
    const packageLockPath = pt.join(dirname, "package-lock.json");

    try
    {
        return require(dotPackageLockPath);
    } catch (error)
    {
        Logger.warn(error.message);
    }

    try
    {
        return require(packageLockPath);
    } catch (error)
    {
        Logger.warn(error.message);
        Logger.error("package-lock.json 依赖项收集失败");
    }

    return {};
}

/**
 *  @param {Array<String>} params 参数数组
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前运行的参数命令对象
 */
function main(params, meta, __this)
{
    const Logger = new LoggerSaver("Collect_Required_Task", meta.cwd, meta.singleMap.isSaveLog.include);

    // 收集依赖配置
    const packages = getPackage(meta.dirname, Logger);

    // 收集依赖名称
    const collects = collectsRequired(meta.dirname, packages, Logger);

    // 收集依赖的目录
    collectModules(collects, Logger);

    Logger.close();
}


module.exports = main;
