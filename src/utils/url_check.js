const list = {
	bili      : "www.bilibili.com",
	ytp       : "www.youtube.com",
	live_bili : "live.bilibili.com",
	drive     : "mypikpak.com",
	tongyi    : "tongyi.aliyun.com",
	dig:      "btdig.com"
};

export function is_host(name) {
	const url = list[name];
	return window.location.host == url;
}
