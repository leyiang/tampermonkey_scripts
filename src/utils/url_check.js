const list = {
    "bili"      : "www.bilibili.com",
    "ytp"       : "www.youtube.com",
    "live_bili" : "live.bilibili.com",
}

export function is_host(name) {
    const url = list[ name ];
    return window.location.host == url;
}
