/**
 *  布尔命令参数类
 *  @version 0.0.2
 */
class Single
{
    /**
    *  @param {String} key 命令的关键字
    *  @param {string} description 简单命令描述
    *  @param {String} [example=""] 命令帮助文档路径
    *  @param {String} [example=""] 模块所在路径.txt）
    */
    constructor(key, description, example, modulePath)
    {
        /** @type {String} 命令 */
        this.key = key;

        /** @type {String} 命令简单描述 */
        this.description = description;

        /** @type {Boolean} 包含此命令 */
        this.include = false;

        /** @type {String} 命令帮助文档路径 */
        this.example = example || "";

        /** @type {String} 模块所在路径 */
        this.modulePath = modulePath || "";
    }
}

module.exports = Single;
