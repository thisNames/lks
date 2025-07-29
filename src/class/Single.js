/**
 *  布尔命令参数类
 *  @version 0.0.1
 */
class Single
{
    /**
    *  @param {String} key 命令的关键字
    *  @param {string} description 简单命令描述
    *  @param {String} [example=""] 命令帮助文档路径
    */
    constructor(key, description, example = "")
    {
        /** @type {String} 命令 */
        this.key = key;

        /** @type {String} 命令简单描述 */
        this.description = description;

        /** @type {Boolean} 包含此命令 */
        this.include = false;

        /** @type {String} 命令帮助文档路径 */
        this.example = example;
    }
}

module.exports = Single;
