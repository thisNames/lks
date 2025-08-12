const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");

const DirItem = require("../class/DirItem");

const OP = require("../options/options");

/**
 *  @param {DirItem} dItem 目录对象
 *  @returns {Number}
 */
function __addItem(dItem)
{

}

/**
 *  添加一个目录路径
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);

    const name = params[0];
    const path = params[1];

    console.log(name, path);


}

module.exports = main;
