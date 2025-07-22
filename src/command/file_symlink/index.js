/**
 *  创建符号链接
 */
const fs = require("node:fs");
const pt = require("node:path");

// class
const MC = require("../../class/MessageCollect");

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

module.exports = async function (params, meta)
{
    let extName = params[0]; // 文件拓展名
    let { key: sourceFolder } = meta; // 源目录

    // 判断源目录是否存在
    if (!fs.existsSync(sourceFolder)) return console.log(`ERROR: 没有这样的目录 => ${sourceFolder}`);

    // 解构参数
    let { isRecursion, recursionDeep, collectFileMaxCount, isSaveLog } = meta;
    // 获取工作路径，符号链接生成路径（目标）
    let workerFolder = pt.resolve("./");
    // 收集文件
    const files = collectFiles(sourceFolder, extName, isRecursion, recursionDeep, collectFileMaxCount);

    // 开始创建符号链接
    let result = await createSymlink(files, workerFolder, item => console.log(item.message));

    // 统计
    let success = result.filter(item => item.ok).length; // 成功的
    let fail = result.length - success; // 失败的
    let counted = `symlink: total is ${result.length}, success is ${success}, fail is ${fail}`;
    console.log(counted);

    if (!isSaveLog) return;

    // 日志
    let name = "file_symlink";
    let mc = new MC(name, workerFolder, collectFileMaxCount + 10);
    result.forEach(item => mc.collect(name, item.message, false));
    mc.collect(name, counted, false);
    mc.close("---");
}
