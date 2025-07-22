const GC = require("../../class/GlobalConfig");

module.exports = function (params, meta)
{
    for (const key in GC)
    {
        if (Object.prototype.hasOwnProperty.call(GC, key))
        {
            const element = GC[key];
            let msg = key.concat(" = ", element)
            console.log(msg);
        }
    }
}
