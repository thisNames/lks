// sec class tools
const { fillParams } = require("./src/class/Tools");

// src index command
const { paramsMap, singleMap } = require("./src/index");

//#region init
process.argv.splice(0, 2);
//#endregion

// main 运行
while (process.argv.length > 0)
{
    let key = process.argv.shift();

    // 通过 name 筛选
    if (paramsMap.has(key))
    {
        console.log("map key run: ", key);// TODO: debug line comment

        let pm = paramsMap.get(key);

        // 填充参数
        fillParams(pm, singleMap.isUseDefaultValue.key);

        // 运行任务
        console.log(pm);// TODO: debug line comment

        pm.running({ key });

        // 结束
        paramsMap.delete(key);
        continue;
    }

    // 通过 params.key 筛选
    for (const p of paramsMap.entries())
    {
        let [pmKey, pm] = p;
        if (pm.key != key && pm.key != "*") continue;

        console.log("map value run: ", pm.key);// TODO: debug line comment

        // 填充参数
        fillParams(pm, singleMap.isUseDefaultValue.key);

        // 运行任务
        console.log(pm);// TODO: debug line comment

        pm.running({ key });

        // 结束
        paramsMap.delete(pmKey);
        break;
    }
}
