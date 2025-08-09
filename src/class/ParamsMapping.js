const Params = require("./Params");

/**
 *  参数命令映射表配置类
 *  @version 0.0.4
 */
class ParamsMapping extends Params
{
    /**
     *  @param {String} mapKey 参数命令键
     *  @param {Params} params params 配置属性
     */
    constructor(mapKey, params)
    {
        if (params.count > params.defaults.length) throw new TypeError("Configuration Error: [count] must be <= [defaults].length");

        super(params);

        /** @type {String} 重写参数命令键 */
        this.mapKey = mapKey;
    }
}

module.exports = ParamsMapping;
