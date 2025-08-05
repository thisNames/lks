/**
 *  转换数字单位，转换为更合适的单位
 *  适合频繁转换数字（例如字节数等）
 *  @version 0.0.3
 */
class FormatByte
{
    /**
     *  @param {number} num 数
     *  @param {Number} base 被除数
     *  @param {Array<String>} levels 层级
     */
    constructor(num, base, levels)
    {
        this.num = num || 0;
        this.base = base || 0;
        this.levels = levels || [];

        this.__KB = 1024;
        this.__MB = this.__KB * 1024;
        this.__GB = this.__MB * 1024;
    }

    /**
     *  将字节(byte)转换为最合适的单位（KB、MB、GB）
     *  @param {number} bytes 字节数
     *  @returns {{value: number, type: "KB" | "MB" | "GB"}}
     */
    formatBytes(bytes)
    {
        let type = { value: 0, type: "B" };

        if (!Number.isFinite(bytes) || bytes < 1) return type;

        if (bytes < this.__KB)
        {
            type.value = bytes;
            type.type = "B";
        } else if (bytes < this.__MB)
        {
            type.value = bytes / this.__KB;
            type.type = "KB";
        } else if (bytes < this.__GB)
        {
            type.value = bytes / this.__MB;
            type.type = "MB";
        } else
        {
            type.value = bytes / this.__GB;
            type.type = "GB";
        }

        // 保留两位小数
        type.value = parseFloat(type.value.toFixed(2));

        return type;
    }

    /**
     *  将数字转换为指定位数
     *  @param {number} num 数字
     *  @param {number} [toFixed=2] 保留几位小数 - 2
     *  @returns {{value: number, type: String}}
     */
    formatNumber(num, toFixed = 2)
    {
        this.num = num;
        let type = { value: 0, type: "B" };

        if (!Number.isFinite(this.num) || !Number.isFinite(this.base) || this.num < 1 || this.base < 1) return type;

        for (let i = 0; i < this.levels.length; i++)
        {
            let l = this.levels[i];

            type.value = this.num;;
            type.type = l;

            if (this.num <= this.base) break;

            this.num = this.num / this.base;
        }

        // 保留两位小数
        type.value = parseFloat(type.value.toFixed(toFixed));

        return type;
    }
}

module.exports = FormatByte;
