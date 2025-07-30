const ParamsMapping = require("./ParamsMapping");
const Params = require("./Params");
const Single = require("./Single");

/**
 *  @description 运行命令时的元数据信息对象，由入口文件定义数据
 *  @version 0.0.1
 */
class MainRunningMeta
{
    /**
     *  @param {MainRunningMeta} meta 配置对象
     */
    constructor(meta)
    {
        /** @type {String} 运行的命令 */
        this.key = meta.key || "";

        /** @type {String} 程序工作目录 */
        this.cwd = meta.cwd || process.cwd();

        /** @type {Number} 程序启动时间戳 */
        this.startTime = meta.startTime || Date.now();

        /** @type {String} 程序所在目录 */
        this.dirname = meta.dirname;

        /** @type {String} 入口文件路径 */
        this.filename = meta.filename;

        /** @type { {[key: string]: Single} } 布尔命令映射表 */
        this.singleMap = meta.singleMap;

        /** @type {Map<String, Params>} 参数命令数组 */
        this.paramsMap = meta.paramsMap;

        /** @type {Array<ParamsMapping>} 参数命令映射表（参数命令列表）*/
        this.paramsMappings = meta.paramsMappings;
    }
}

module.exports = MainRunningMeta;
