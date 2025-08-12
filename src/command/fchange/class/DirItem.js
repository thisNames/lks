/**
 *  一个目录对象
 */

class DirItem
{
    /**
     *  @param {DirItem} option
     */
    constructor(option)
    {
        const {
            id = 0,
            path = "",
            name = ""
        } = option || {};

        /** @type {number} 目录编号 */
        this.id = id;

        /** @type {String} 目录路径 */
        this.path = path;

        /** @type {String} 目录别名 */
        this.name = name;
    }

    /**
     *  打开一个资源管理器，打开的目录为本实例的目录
     *  @returns {void}
     */
    open()
    {

    }

    /**
     *  修改当前终端的工作目录
     *  @returns {void}
     */
    change()
    {

    }
}

module.exports = DirItem;
