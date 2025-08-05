/**
 *  事件映射类
 *  @version 0.0.1
 */
class EventMapping
{
    constructor()
    {
        /** @type {Map<String, Function>} 事件 */
        this.events = new Map();
    }

    /**
     *  触发事件
     *  @param {Number} type 事件类型
     *  @param {...*} argv 参数
     *  @returns {void} this
     */
    __emit(type, ...argv)
    {
        const cb = this.events.get(type);
        cb && cb(...argv);
    }

    /**
     *  监听事件（会覆盖）
     *  @param {String} type 事件类型 ==> Download.EventType
     *  @param {Function} callback 回调
     *  @returns {void} this
     */
    listener(type, callback)
    {
        this.events.set(type, callback);
    }
}

module.exports = EventMapping
