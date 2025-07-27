/**
 *  显示加载
 */
class Loading
{
    /**
     *  @param {Number} [speed=100] 旋转的速度，毫秒
     */
    constructor(speed = 100)
    {
        this.__spinner = null;
        this.__index = 0;

        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.speed = speed;
    }

    /**
     *  @param {string} [msg="Done"] 提示
     *  @returns {Loading} this
     */
    start(msg = "Loading")
    {
        if (this.__spinner === null)
        {
            this.__spinner = setInterval(() =>
            {
                const frame = this.frames[this.__index % this.frames.length];
                process.stdout.write(`\r${frame} ${msg}`);
                this.__index++;
            }, this.speed);
        }

        return this;
    }

    /**
     *  @param {Boolean} success 加载成功还是失败
     *  @param {string} [msg="Done"] 提示
     *  @returns {Loading} this
     */
    stop(success, msg = "Done")
    {
        if (this.__spinner !== null)
        {
            clearInterval(this.__spinner);

            let binggo = success ? "✅" : "❌";

            this.__spinner = null;
            this.__index = 0;

            process.stdout.write(`\r${binggo} ${msg}         \n`);
        }

        return this;
    }
}

module.exports = Loading;
