const Params = require("./Params");

/**
 *  参数命令映射表配置类
 *  @version 0.0.1
 */
class ParamsMapping
{
    /**
     *  @param {String} mapKey 参数命令键
     *  @param {Params} params params 属性
     */
    constructor(mapKey, params)
    {
        if (params.count > params.defaults.length) throw new TypeError("Configuration Error: [count] must be <= [defaults].length");

        /** @type {String} */
        this.mapKey = mapKey;

        /** @type {Params} */
        this.params = new Params(params.key, params.count, params.defaults, params.description, params.index, params.example || "");
    }

    /**
     *  添加一个任务
     *  @param {String} name 任务名称
     *  @param {Function} task 任务
     *  @returns {ParamsMapping} this
     */
    addTask(name, task)
    {
        this.params.addTask(name, task);
        return this;
    }
}

module.exports = ParamsMapping;
