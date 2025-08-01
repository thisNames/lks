/**
 *  转换数字单位，转换为更合适的单位
 *  适合频繁转换数字（例如字节数等）
 *  @version 0.0.1
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
        if (typeof bytes !== "number" || bytes < 1) return { value: 0, type: "B" };

        let value, type;

        if (bytes < this.__KB)
        {
            value = bytes;
            type = "B";
        } else if (bytes < this.__MB)
        {
            value = bytes / this.__KB;
            type = "KB";
        } else if (bytes < this.__GB)
        {
            value = bytes / this.__MB;
            type = "MB";
        } else
        {
            value = bytes / this.__GB;
            type = "GB";
        }

        // 保留两位小数
        value = parseFloat(value.toFixed(2));

        return { value, type };
    }

    /**
     *  将数字转换为指定位数
     *  @param {number} [toFixed=2] 保留几位小数 - 2
     *  @returns {{value: number, type: String}}
     */
    formatNumber(toFixed = 2)
    {
        let value = 0, type = "";

        if (typeof this.num != "number" || typeof this.base != "number" || this.num < 1 || this.base < 1) return { value, type };

        for (let i = 0; i < this.levels.length; i++)
        {
            let l = this.levels[i];

            value = this.num;;
            type = l;

            if (this.num <= this.base) break;

            this.num = this.num / this.base;
        }

        // 保留两位小数
        value = parseFloat(value.toFixed(toFixed));

        return { value, type };
    }
}

module.exports = FormatByte;
