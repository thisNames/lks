/**
 *  创建符号链接
 */
const fs = require("node:fs");
const pt = require("node:path");

// class
const LoggerSaver = require("../../class/LoggerSaver");
const Tools = require("../../class/Tools");
const MainRunningMeta = require("../../class/MainRunningMeta");
const Params = require("../../class/Params");

const OP = require("./lib/option");

/**
 *  收集文件
 *  @param {String} sourceFolder 源目录路径
 *  @param {String} extName 文件后缀名称
 *  @param {Boolean} isRecursion 使用递归
 *  @param {Number} recursionDeep 递归最大深度
 *  @param {Number} collectFileMaxCount 文件收集最大数量，如果等于 -1 则不做限制
 *  @returns {Array<String>} 文件集合
 */
function collectFiles(sourceFolder, extName, isRecursion, recursionDeep, collectFileMaxCount)
{
    // 文件数组
    const selectFiles = [];

    // 限制递归深度
    if (recursionDeep < 0) return selectFiles;
    recursionDeep = recursionDeep - 1;

    // 收集目录里所有的项目（目录，文件）
    const items = fs.readdirSync(sourceFolder, "utf-8");

    // 选择文件
    for (let i = 0; i < items.length; i++)
    {
        if (collectFileMaxCount > 0 && selectFiles.length >= collectFileMaxCount) break;

        const item = items[i];
        let filePath = pt.join(sourceFolder, item);

        // 是一个目录 
        if (fs.statSync(filePath).isDirectory() && isRecursion)
        {
            const child = collectFiles(filePath, extName, isRecursion, recursionDeep, collectFileMaxCount);
            // 填充文件
            for (let j = 0; j < child.length; j++)
            {
                const element = child[j];
                if (collectFileMaxCount > 0 && selectFiles.length >= collectFileMaxCount) break;

                selectFiles.push(element);
            }
        }
        else
        {
            // 是一个文件
            if (collectFileMaxCount > 0 && selectFiles.length >= collectFileMaxCount) break;
            if (pt.extname(filePath) != extName) continue;
            // 填充文件
            selectFiles.push(filePath);
        }
    }
    return selectFiles;
}

/**
 *  创建符号链接
 *  @param {Array<String>} files 文件集合
 *  @param {String} workerFolder 符号链接目标路径
 *  @param {Function} progress 完成一个创建的回调
 *  @returns {Promise<Array<{ok: String, message: String}>>} 执行结果集合
 */
async function createSymlink(files, workerFolder, progress)
{
    let tasks = [];

    for (let i = 0; i < files.length; i++)
    {
        let sourceFilePath = files[i];
        let symlinkFilePath = pt.join(workerFolder, pt.basename(sourceFilePath));

        // 异步
        let task = new Promise((res, _) =>
        {
            fs.symlink(sourceFilePath, symlinkFilePath, "file", error =>
            {
                let result = {
                    ok: true,
                    message: "OK: ".concat(sourceFilePath, " -> ", symlinkFilePath)
                };

                if (error)
                {
                    result.ok = false;
                    result.message = "ERROR: ".concat(error.message);
                }

                res(result);
                progress(result);
            });
        });

        tasks.push(task);
    }

    let results = await Promise.all(tasks);
    return results;
}

/**
 *  @param {Array<String>} files 文件集合
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {LoggerSaver} 原来的日志记录器
 */
function printCollectFiles(files, Logger)
{
    // 打印
    let counted = `counted: total is ${files.length}`;
    files.forEach(filename => Logger.info(filename));
    Logger.success(counted);

    return Logger;
}

/**
 *  SymbolicLink（符号链接）命令，为指定的源目录生成符号链接
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
async function main(params, meta, __this, taskName)
{
    // 解构参数
    let extName = params[0]; // 文件拓展名
    let isSaveLog = meta.singleMap.isSaveLog.include;
    let sourceFolder = meta.key;
    let workerFolder = meta.cwd || process.cwd();

    const Logger = new LoggerSaver(taskName, workerFolder, isSaveLog);

    // 检测是否是管理员运行
    if (!Tools.isAdministrator()) return Logger.error("你没有管理员权限，无法执行。").close();

    // 判断源目录是否存在
    if (!fs.existsSync(sourceFolder)) return Logger.error(`ERROR: 没有这样的目录 => ${sourceFolder}`).close();

    // 收集文件
    const files = collectFiles(sourceFolder, extName, OP.isRecursion, OP.recursionDeep, OP.maxFile);

    // 打印收集，不创建符号链接
    if (OP.isDisplayOnly) return printCollectFiles(files, Logger).close();

    // 开始创建符号链接
    let result = await createSymlink(files, workerFolder, item => item.ok ? Logger.info(item.message) : Logger.error(item.message));

    // 统计创建的符号链接
    let success = result.filter(item => item.ok).length; // 成功的
    let fail = result.length - success; // 失败的
    let counted = `counted: total is ${result.length}, success is ${success}, fail is ${fail}`;
    Logger.success(counted).close();
}

module.exports = main;
