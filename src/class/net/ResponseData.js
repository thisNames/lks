/**
 *  响应数据对象类
 *  @version 0.0.1
 */
class ResponseData
{
    /**
     *  @param {Number} code 响应状态码
     */
    constructor(code = 0)
    {
        /** @type {Number} 响应状态码 */
        this.code = code;

        /** @type {Object} 响应状数据 */
        this.data = null;

        /** @type {String} 响应消息 */
        this.message = "";
    }
}
module.exports = ResponseData;
