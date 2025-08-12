const option = require("../options/options");

/**
 *  设置 terminal
 *  @param {BarProp} value 启用/禁用终端操作
 *  @returns {Void} 
 */
function setTerminal(value)
{
    option.terminal = value;
}

module.exports = {
    setTerminal
};

