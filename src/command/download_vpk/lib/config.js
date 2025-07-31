module.exports = {
    steam: {
        base: "https://api.steampowered.com",
        api: {
            GetCollectionDetails: {
                uri: "/ISteamRemoteStorage/GetCollectionDetails/v1/",
                desc: "查询集合"
            },
            GetPublishedFileDetails: {
                uri: "/ISteamRemoteStorage/GetPublishedFileDetails/v1/",
                desc: "查询文件"
            }
        },
        headers: {
            "User-Agent": "www.wisps.top",
            "Host": "api.steampowered.com",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "Accept": "*/*",
            "Connection": "keep-alive"
        }
    },
    test: {
        base: "http://127.0.0.1:8000",
        api: {
            GetCollectionDetails: {
                uri: "/GetCollectionDetails"
            },
            GetPublishedFileDetails: {
                uri: "/GetPublishedFileDetails"
            }
        },
        headers: {}
    }
}