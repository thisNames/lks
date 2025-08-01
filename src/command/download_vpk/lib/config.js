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
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
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
            },
            steamIOQuery: {
                uri: "/api/details/file"
            }
        },
        headers: {}
    },
    steamio: {
        base: "https://steamworkshopdownloader.io",
        api: {
            steamIOQuery: {
                uri: "/api/details/file"
            }
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "origin": "https://steamworkshopdownloader.io",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Host": "steamworkshopdownloader.io",
            "Connection": "keep-alive"
        }
    }
}