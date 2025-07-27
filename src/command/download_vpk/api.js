/**
 *  steam web api 接口
 *  @method POST
 *  @description GetPublishedFileDetails 获取发布的文件详情
 *  @link https://partner.steamgames.com/doc/webapi/ISteamRemoteStorage
 */
const Steam_GetPublishedFileDetails_API = "https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/";

/**
 *  steam web api 接口
 *  @method POST
 *  @description GetCollectionDetails 获取发布的集合详情
 *  @link https://partner.steamgames.com/doc/webapi/ISteamRemoteStorage
 */
const Steam_GetCollectionDetails_API = "https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/";

/**
 *  测试 API
 */
const Test_API = new URL("http://127.0.0.1:8081/");

module.exports = {
    Steam_GetCollectionDetails_API,
    Steam_GetPublishedFileDetails_API,
    Test_API
}
