/**
 *  创意工坊文件示例
 *  @version 0.0.3
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

        /** @type {String} 索引 */
        this.index = 0;

        /** @type {String} 备注 */
        this.remark = "";

        /** @type {String} 保存的目录 */
        this.folder = "";
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
                if (value === undefined || value === null)
                {
                    throw new Error(`[${key}] 尝试设置空值`);
                }

                // 无效的 Number
                if (typeof value === "number" && !Number.isFinite(value))
                {
                    throw new Error(`[${key}] 是无效的数值`);
                }

                // 检查字符串类型，防止注入攻击或空字符串
                if (typeof value === "string" && value.trim() === "")
                {
                    throw new Error(`[${key}] 是空字符串`);
                }

                // 检查键是否存在于目标对象中，防止意外添加新属性
                if (!Object.prototype.hasOwnProperty.call(target, key))
                {
                    throw new Error(`[${key}] 不是有效的属性`);
                }

                return Reflect.set(target, key, value);
            }
        });

        return proxy;
    }
}

module.exports = WorkshopFile;
