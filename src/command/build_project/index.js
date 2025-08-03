const fs = require("node:fs");
const pt = require("node:path");

const Params = require("../../class/Params");
const MainRunningMeta = require("../../class/MainRunningMeta");
const LoggerSaver = require("../../class/LoggerSaver");

const ModulePath = require("./class/ModulePath");

const OPTION = require("./config/option");
const Tools = require("../../class/Tools");

/**
 *  是否忽略这个文件
 *  @param {String} name 名称
 *  @returns {Boolean} 是否通过过滤器
 */
function ignoreThisFile(name)
{
    if (OPTION.ignoreFiles.includes(name)) return true;

    if (OPTION.ignoreFilesExt.includes(pt.extname(name))) return true;


    for (let i = 0; i < OPTION.ignoresReg.length; i++)
    {
        const reg = OPTION.ignoresReg;

        if (reg instanceof RegExp)
        {
            if (reg.test(name)) return true;
        }
    }

    return false;
}

/**
 *  获取版本信息
 *  @param {MainRunningMeta} meta meta
 */
function getVersion(meta)
{
    try
    {
        const PACKAGE = require(pt.join(meta.cwd + "", "package.json"));
        return PACKAGE.version || 'unknown';
    } catch (error)
    {
        return 'unknown';
    }
}

/**
 *  处理输入目录
 *  @param {String} dirname 输出的目录
 *  @param {String} info 文件信息，比如版本信息
 *  @returns {String} 输出的目录
 */
function handlerOutput(dirname, info = "")
{
    let output = pt.join(dirname, Tools.sanitizeFolderName(OPTION.output), Tools.sanitizeFolderName(OPTION.name + info));
    let isExists = fs.existsSync(output);
    let id = "";

    if (isExists && fs.statSync(output).isFile())
    {
        id = Tools.generateHashId(16);
        output = output + "_" + id;
    }

    if (!isExists || id)
    {
        fs.mkdirSync(output, { recursive: true });
    }

    return output;
}

/**
 *  开始收集依赖
 *  @param {Array<ModulePath>} modulesPaths 模块路径对象数组
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function collector(meta, modulesPaths, Logger)
{
    const output = handlerOutput(meta.cwd + "", "-" + getVersion(meta));

    for (let i = 0; i < modulesPaths.length; i++)
    {
        const mdp = modulesPaths[i];
        const modulePath = pt.join(output, mdp.level);

        if (fs.existsSync(modulePath))
        {
            Logger.prompt(`Exists: ${modulePath}`);
        }
        else
        {
            fs.mkdirSync(modulePath, { recursive: true });
            Logger.info(`Build: ${mdp.level} => ${modulePath}`);
        }


        // 新建目录
        for (let j = 0; j < mdp.childrenFolders.length; j++)
        {
            const relativeFolderPath = mdp.childrenFolders[j];
            const absFolderPath = pt.join(modulePath, relativeFolderPath);

            if (fs.existsSync(absFolderPath))
            {
                Logger.prompt(`Exists:  ${absFolderPath}`);
            }
            else
            {
                fs.mkdirSync(absFolderPath, { recursive: true });
                Logger.info(`Mkdir: ${mdp.level} => ${absFolderPath}`);
            }
        }

        // 拷贝文件
        for (let j = 0; j < mdp.childrenFiles.length; j++)
        {
            const relativeFileName = mdp.childrenFiles[j];
            const absFileName = pt.join(modulePath, relativeFileName);

            if (!absFileName.startsWith(output))
            {
                Logger.error(`forbidden :${mdp.level} => ${absFileName}`);
                continue;
            }

            const content = fs.readFileSync(pt.join(mdp.source, relativeFileName), { encoding: "utf-8", flag: "r" });
            fs.writeFileSync(absFileName, content, { encoding: "utf-8", flag: "w" });

            Logger.info(`Copy: ${mdp.level} => ${absFileName}`);
        }
    }
}

/**
 *  收集模块里的子项目
 *  @param {Array<ModulePath>} modulesPaths 模块路径对象数组
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function fillChildren(modulesPaths, Logger)
{
    for (let i = 0; i < modulesPaths.length; i++)
    {
        const mdp = modulesPaths[i];

        // 路径不存在
        if (!fs.existsSync(mdp.source) || !fs.statSync(mdp.source).isDirectory())
        {
            Logger.warn(`invalid path ${mdp.source}`);
            continue;
        }

        // 读目录
        const items = fs.readdirSync(mdp.source, { encoding: "utf-8", recursive: true, withFileTypes: true });

        for (let j = 0; j < items.length; j++)
        {
            const item = items[j];
            const absPath = pt.join(item.parentPath, item.name);
            const relativePath = absPath.replace(mdp.source, "");

            if (item.isFile())
            {
                if (ignoreThisFile(item.name))
                {
                    Logger.warn(`ignored file ${absPath}`);
                    continue;
                }
                mdp.childrenFiles.push(relativePath);
                continue;
            }

            if (item.isDirectory())
            {
                mdp.childrenFolders.push(relativePath);
                continue;
            }

            Logger.warn(`The ignorant item: ${absPath}`);
        }
    }
}

/**
 *  @param {MainRunningMeta} meta meta
 *  @param {Object} packageLock package-lock.json 配置对象
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {Array<ModulePath>}
 */
function collectsRequired(meta, packageLock, Logger)
{
    const dirname = meta.dirname + "";
    const modulesPaths = [];
    const packages = packageLock?.packages;

    if (typeof packages != "object" || !packages) return collects;

    for (const key in packages)
    {
        if (Object.prototype.hasOwnProperty.call(packages, key))
        {
            const item = packages[key];

            if (typeof item != "object" || !item) continue;
            if (key === "" || item.dev) continue;

            let source = pt.join(dirname, key);

            modulesPaths.push(new ModulePath(source, key));
            Logger.info(`required: ${source}`);
        }
    }

    return modulesPaths;
}

/**
 *  获取 package-lock.json 文件
 *  @param {MainRunningMeta} meta meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {object} package-lock.json 文件解析出来的对象
 */
function getPackageLock(meta, Logger)
{
    let dirname = meta.dirname + "";

    try
    {
        const dotPackageLockPath = pt.join(dirname, "node_modules", ".package-lock.json");
        return require(dotPackageLockPath);
    } catch (error)
    {
        Logger.warn(error.message);
    }

    try
    {
        const packageLockPath = pt.join(dirname, "package-lock.json");
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

    // 读取 package-lock.json 文件
    const packageLock = getPackageLock(meta, Logger);

    // 收集模块的路径
    const modulesPaths = collectsRequired(meta, packageLock, Logger);

    // 填充模块的子项目
    fillChildren(modulesPaths, Logger);

    // 开始收集
    collector(meta, modulesPaths, Logger);

    // 收集主项目

    Logger.close();
}


module.exports = main;
