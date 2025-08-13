const DirItem = require("../class/DirItem");

/**
 *  初始化列表
 *  @returns {Array<DirItem>}
 */
function __loadDirData()
{
    const list = [];
    try
    {
        const data = require("./data/dir.json");

        for (let i = 0; i < data.length; i++)
        {
            const item = data[i];

            const dm = new DirItem({
                name: item.name,
                path: item.path
            });

            list.push(dm);
        }

        return list;

    } catch (error)
    {
        return list;
    }
}

const option = {
    // 打开一个目录，还是直接修改当前终端的工作目录
    terminal: false,

    // 目录的列表
    list: __loadDirData()
};

module.exports = option;
