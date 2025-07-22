/**
 *  布尔命令参数类
 */
class Single
{
    /**
    *  @param {String} key 命令的关键字
    *  @param {string} [description=null] 命令描述
    */
    constructor(key, description = null)
    {
        this.key = key;
        this.description = description;
    }
}

module.exports = Single;
