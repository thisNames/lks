const fs = require("node:fs");

/**
 *  @description 封装路径层级与路径层级中的模块信息，为依赖收集提供数据支持
 *  @version 0.0.1
 */
class ModulePath
{

    /**
     *  @param {String} source 源路径
     *  @param {String} level 路径层级
     */
    constructor(source, level)
    {
        /** @type {String} 源路径 */
        this.source = source + "";

        /** @type {String} 路径层级 */
        this.level = level + "";

        /** @type {Array<String>} 子目录相对路径 */
        this.childrenFolders = [];

        /** @type {Array<String>} 子文件相对路径 */
        this.childrenFiles = [];
    }
}

module.exports = ModulePath;
