const { formatBytes } = require("./Tools");

/**
 *  创意工坊文件示例
 */
class WorkshopFile
{
    constructor()
    {
        /** @type {String} 文件 id */
        this.id = "";

        /** @type {String} 文件名称 */
        this.filename = "";

        /** @type {Number} 文件大小，字节 */
        this.file_size = 0;

        /** @type {String} 文件大小，KB, MB GB */
        this.size = "";

        /** @type {String} 文件下载地址 */
        this.file_url = "";

        /** @type {String} 创意工坊标题 */
        this.title = "";
    }


    /**
     *  工程函数，创建一个 WorkshopFile 的 Proxy 代理对象
     *  @description 需要强行数据校验
     *  @returns {WorkshopFile}
     */
    static createWorkshopFileProxy()
    {
        const proxy = new Proxy(new WorkshopFile(), {
            get(target, key)
            {
                return Reflect.get(target, key);
            },
            set(target, key, value)
            {
                // 拒绝空值
                if (value === undefined || value === null) throw new Error(`[${key}] try to set a null value`);
                // 无效的 Number
                if (typeof value == "number" && !Number.isFinite(value)) throw new Error(`[${key}] is NaN or Infinity`);

                Reflect.set(target, key, value);
            }
        });

        return proxy;
    }
}

module.exports = WorkshopFile;
