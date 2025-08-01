const WorkshopFile = require("../../../class/WorkshopFile");
const Tools = require("../../../class/Tools");

/**
 *  用于处理 steam workshop 资源信息
 *  @param {Array<Object>} details 集合
 *  @returns {Array<WorkshopFile>} 文件对象集合
 */
function parseDetails(details)
{
    const workshopFiles = [];

    for (let i = 0; i < details.length; i++)
    {
        const element = details[i];

        if (typeof element != "object" || element.result != 1) continue;

        const workshopFile = WorkshopFile.createWorkshopFileProxy();

        try
        {
            workshopFile.index = i;
            workshopFile.id = element.publishedfileid;
            workshopFile.title = element.title;
            workshopFile.filename = element.filename;
            workshopFile.file_url = element.file_url;
            workshopFile.file_size = Number.parseInt(element.file_size);

        } catch (error)
        {
            continue;
        }

        // 计算文件大小
        let size = Tools.formatBytes(workshopFile.file_size);
        workshopFile.size = size.value + size.type;

        workshopFiles.push(workshopFile);
    }

    return workshopFiles;
}

module.exports = parseDetails;
