const Single = require("./Single");

/**
 *  参数命令参数类
 */
class Params extends Single
{
    /**
     *  @description 注意：defaults 数组的长度，必须要和 count 一致（defaults.length = count）
     *  @param {String} key 命令的关键字
     *  @param {Number} count 命令后面跟的参数个数。如果值为小于0，那么后面的参数都将作为 params，defaults 参数将不会生效
     *  @param {Array<String>} defaults 默认参数数组
     *  @param {string} description 简单命令描述
     *  @param {String} [example=""] 命令帮助文档路径
     */
    constructor(key, count, defaults, description, example = "")
    {
        super(key, description, example);
        this.count = count;
        this.defaults = defaults;

        /**
         *  @type {Array<String>} 参数数组
         */
        this.params = [];


        /**
         *  @type {Map<String, Function>} 任务数组
         */
        this.__tasks = new Map();

        /**
         *  @type {Map<String, Object>} 任务结果数组
         */
        this.__taskResults = new Map();
    }


    /**
     *  添加一个任务
     *  @param {String} name 任务名称
     *  @param {Function} task 任务
     *  @returns {Params} this
     */
    addTask(name, task)
    {
        this.__tasks.set(name, task);
        return this;
    }

    /**
     *  运行任务
     *  @param {Object} [meta=null] 其他参数
     *  @returns {Params} this
     */
    running(meta = {})
    {
        this.__tasks.forEach((v, k) =>
        {
            this.__taskResults.set(k, v(this.params, meta));
        });
        return this;
    }

    /**
     *  获取指定名称任务的执行结果，没有则返回 null
     *  @param {String} name 事件的名称
     */
    getTaskResult(name)
    {
        if (this.__taskResults.has(name))
        {
            return this.__taskResults.get(name);
        }
        return null;
    }

    /**
     *  获取所以任务的执行结果
     *  @returns {Map<String, Object>}
     */
    getTaskResults()
    {
        return this.__taskResults;
    }
}

module.exports = Params;
