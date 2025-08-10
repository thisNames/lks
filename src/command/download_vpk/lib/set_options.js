const OP = require("./option");

/**
 * 设置 api
 * @param {String} value api 的名称
 */
function setApi(value)
{
    OP.api = value;
}

module.exports = {
    setApi
};
