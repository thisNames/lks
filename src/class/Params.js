const Single = require("./Single");

/**
 *  参数命令参数类
 *  @version 0.0.5
 *  @description
 *  执行顺序：
 *      前置命令先执行（running），如果都是前置，那么就按照终端输入的顺序执行（先后顺序执行）；
 *      普通指令（before=false），等所有的前置命令都执行结束后，按照终端输入的顺序执行（先后顺序执行）；
 */
class Params extends Single
{
    /**
     *  @description 注意：defaults 数组的长度，必须要和 count 一致（defaults.length = count）
     *  @param {String} key 命令的关键字
     *  @param {Number} count 命令后面跟的参数个数。如果值为小于0，那么后面的参数都将作为 params，defaults 参数将不会生效
     *  @param {Array<String>} defaults 默认参数数组
     *  @param {string} description 简单命令描述
     *  @param {String} example 命令帮助文档文件名称（example.txt）
     */
    constructor(option)
    {
        const {
            key = null,
            count = 0,
            defaults = [],
            description = "",
            example = "",
            before = false
        } = option || {};

        super(key, description, example);

        /** @type {Number} 命令所需要的参数个数，-1则表示后面所有的参数都作为 params 的值，defaults 不生效 */
        this.count = count;

        /** @type {Array<String>} 参数默认值数组，长度必须要和 count 一致 */
        this.defaults = defaults;

        /** @type {Boolean} 表示是一个前置执行命令（一般是用于设置配置之类的操作）*/
        this.before = before;

        /** @type {Array<String>} 参数数组 */
        this.params = [];


        /** @type {Map<String, Function>} 任务数组 */
        this.__tasks = new Map();

        /** @type {Map<String, Object>} 任务结果数组 */
        this.__taskResults = new Map();

        /** @type {Map<String, Function>} 任务结束数组 */
        this.__tasksAfter = new Map();// TODO: __tasksAfter

        /** @type {Map<String, Function>} 所有任务结束数组 */
        this.__allTasksAfter = new Map();// TODO: __allTasksAfter

        /** @type {Map<String, Params>} mayKey 参数命令映射表（子命令） */
        this.__PARAMS_MAP = new Map();// TODO: __PARAMS_MAP

        /** @type {Map<String, Params>} params.key 参数命令映射表（子命令） */
        this.__PARAMS_KEY_MAP = new Map();// TODO: __PARAMS_KEY_MAP

        /** @type {Number} 当前参数命令的执行索引，-1表示根本没有执行过；索引从0开始，表示你是第几个被执行的参数命令 */
        this.__index = -1;// TODO: __index
    }

    /**
     *  添加一个任务之后的事件
     *  @param {String} name 任务名称
     *  @param {Function} task 任务
     *  @returns {Params} this
     */
    addListenerTasksAfter(name, task)
    {
        this.__tasksAfter.set(name, task);
        return this;
    }

    /**
     *  任务运行结束
     *  @param {Object} [meta={}] 其他参数
     *  @returns {Params} this
     */
    runningAfter()
    {
        // TODO: runningAfter()
    }

    /**
     *  添加一个所有任务之后的事件
     *  @param {String} name 任务名称
     *  @param {Function} task 任务
     *  @returns {Params} this
     */
    addListenerAllTasksAfter(name, task)
    {
        this.__allTasksAfter.set(name, task);
        return this;
    }

    /**
     *  所有任务运行结束
     *  @param {Object} [meta={}] 其他参数
     *  @returns {Params} this
     */
    runningAllAfter()
    {
        //TODO: runningAllAfter()
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
     *  @param {Object} [meta={}] 其他参数
     *  @returns {Params} this
     */
    running(meta = {})
    {
        this.__tasks.forEach((v, k) =>
        {
            this.__taskResults.set(k, v(this.params, meta, this));
        });
        return this;
    }

    /**
     *  获取指定名称任务的执行结果，没有则返回 null
     *  @param {String} name 事件的名称
     *  @returns {Object | null}
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
     *  获取所有任务的执行结果
     *  @returns {Map<String, Object>}
     */
    getTaskResults()
    {
        return this.__taskResults;
    }

    /**
     *  获取模块所在的路径
     *  @returns {String}
     */
    getModelPath()
    {
        return this.__model;
    }

    /**
     *  获取参数命令执行索引
     *  @returns {Number}
     */
    getIndex()
    {
        return this.__index;
    }
}

module.exports = Params;
