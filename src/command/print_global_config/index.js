const GC = require("../../class/GlobalConfig");
const Logger = require("../../class/Logger");

module.exports = function (params, meta)
{
    for (const key in GC)
    {
        if (Object.prototype.hasOwnProperty.call(GC, key))
        {
            const element = GC[key];
            let msg = key.concat(" = ", element)
            Logger.info(msg);
        }
    }
}
