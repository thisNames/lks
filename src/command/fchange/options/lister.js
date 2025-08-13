const fs = require("node:fs");
const pt = require("node:path");

const DirItem = require("../class/DirItem");

const OP = require("./options");

/**
 *  查找目录选项
 *  @param {String} name 名称
 *  @param {String} pathname 名称
 *  @param {Boolean} vague 启用模糊匹配
 *  @returns {Array<{index: Number, item: DirItem}>}
 */
function findDirItems(name, pathname, vague = false)
{
    const results = [];

    if (isEmptyList()) return results;

    for (let i = 0; i < OP.list.length; i++)
    {
        const item = OP.list[i];

        let has = vague ? item.name.includes(name) || item.path.includes(pathname) : item.name.trim() == name || item.path.trim() == pathname;
        has && results.push({ index: i, item: item });
    }

    return results;
}

/**
 *  打印列表
 *  @param {Array<DirItem>} list 目录集合
 *  @param {(value: Object, index: Number) => [Number, DirItem]} indexCallback 打印的回调函数，指定 index
 *  @returns {Array<String>}
 */
function printLister(list, indexCallback)
{
    const __lines = [];

    for (let i = 0; i < list.length; i++)
    {
        const item = list[i];
        const [index = 0, dItem = "null"] = indexCallback(item, i);
        const lines = `index: [${index}], name: [${dItem.name}] => ${dItem.path}`;

        __lines.push(lines);
    }

    return __lines;
}

/**
 *  检查是否包含空项目
 *  @returns {boolean}
 */
function isEmptyList()
{
    if (!Array.isArray(OP.list) || OP.list.length < 1) return true;
    return false;
}


/**
 *  保存目录集合数据
 *  @param {Array<DirItem>} list 目录集合
 *  @returns {String} 文件路径 | 错误信息
 */
function dirListSaver(list)
{
    const saverPath = pt.join(__dirname, "./data/dir.json");

    try
    {
        fs.writeFileSync(saverPath, JSON.stringify(list), { encoding: "utf8", flag: "w" });
        return `Saver Success: ${saverPath}`;
    } catch (error)
    {
        return "Saver Failed: " + error.message || "";
    }
}

/**
 *  获取 list 的长度
 *  @returns {Number} list 的长度
 */
function listTotal()
{
    if (isEmptyList()) return 0;
    return OP.list.length;
}

/**
 *  获取列表内容
 *  @returns {Array<DirItem>}
 */
function lister()
{
    if (isEmptyList()) return [];
    return OP.list;
}

/** 
 *  新增多个目录路径
 *  @param {String} name 名称
 *  @param {String} path 路径
 *  @returns {Number} 索引
 */
function addItems(name, path)
{
    const dItem = new DirItem({
        name: name,
        path: path
    });

    OP.list.push(dItem);

    return OP.list.length - 1;
}

/**
 *  删除多个目录路径
 *  @param {Array<Number>} listId 索引集合
 *  @returns {Array<{index: Number, item: DirItem}>}
 */
function deleteItems(listId)
{
    const deList = [];

    for (let i = 0; i < listId.length; i++)
    {
        const index = listId[i];

        if (index > OP.list.length - 1) break;

        const item = OP.list[index];

        if (!item) continue;

        deList.push({ index: index, item: item });

        OP.list[index] = null;
    }

    OP.list = OP.list.filter((v) => v !== null);

    return deList;
}

module.exports = {
    findDirItems,
    printLister,
    isEmptyList,
    dirListSaver,
    listTotal,
    lister,
    addItems,
    deleteItems
};
