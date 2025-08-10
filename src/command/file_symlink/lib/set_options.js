const Tools = require("../../../class/Tools");

const OP = require("./option");

/**
 *  设置 isDisplayOnly
 *  @param {Boolean} isDisplayOnly 值
 *  @returns {void}
 */
function setDisplayOnly(isDisplayOnly)
{
    OP.isDisplayOnly = isDisplayOnly;
}

/**
 *  设置 isRecursion
 *  @param {Boolean} isDisplayOnly 值
 *  @returns {void}
 */
function setRecursion(isRecursion)
{
    OP.isRecursion = isRecursion;
}

/**
 *  设置 recursionDeep
 *  @param {Number} recursionDeep 值
 *  @returns {void}
 */
function setRecursionDeep(recursionDeep)
{
    OP.recursionDeep = Tools.typeInt(recursionDeep, OP.recursionDeep);
}

/**
 *  设置 collectFileMaxCount
 *  @param {Number} collectFileMaxCount 值
 *  @returns {void}
 */
function setCollectFileMaxCount(collectFileMaxCount)
{
    OP.maxFile = Tools.typeInt(collectFileMaxCount, OP.maxFile);
}

module.exports = {
    setDisplayOnly,
    setRecursion,
    setRecursionDeep,
    setCollectFileMaxCount
};
