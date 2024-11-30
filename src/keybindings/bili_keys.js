import { slog, center_player } from "../utils/utils";

// dir = {prev|next}
function navigate_page(dir) {
	const wait = 150;

	// Search Page
	if (window.location.host == "search.bilibili.com") {
		const wrap = document.querySelector(".vui_pagenation--btns");

		dir == "prev"
			? wrap.firstElementChild?.click()
			: wrap.lastElementChild?.click();

		setTimeout(() => {
			document.documentElement.scrollTop = 227;
		}, wait);
		// Space Page
	} else if (window.location.host == "space.bilibili.com") {
		if (dir == "prev") {
			document.querySelector(".be-pager-prev")?.click();
		} else {
			document.querySelector(".be-pager-next")?.click();
		}

		setTimeout(() => {
			document.documentElement.scrollTop = 452;
		}, wait);
	}
}

function send_key_press(key = "ArrowRight", eventType = "keydown") {
	const keyCode = {
		ArrowLeft: 37,
		ArrowRight: 39,
		ArrowUp: 38,
		ArrowDown: 40,
		d: 68,
	}[key];

	const evt = new KeyboardEvent(eventType, {
		key: key,
		code: key,
		keyCode: keyCode,
		which: keyCode,
		altKey: false,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false,
		repeat: false,
		bubbles: true,
	});

	window.dispatchEvent(evt);
}
export function bili_keys(e) {
	if (e.key === "`") {
		let curFull = !!document.fullscreenElement;

		const btn = document.querySelector(".bpx-player-ctrl-full").click();

		if (curFull && document.documentElement.scrollTop < 690) {
			// 让播放器在屏幕居中
			center_player();
		}
	} else if (e.key == "a" || e.key == "s") {
		if (document.activeElement.tagName == "INPUT") {
			return;
		}

		if (
			["search.bilibili.com", "space.bilibili.com"].includes(
				window.location.host,
			)
		) {
			navigate_page(
				// "1" means prev
				// "2" means next
				e.key == "a" ? "prev" : "next",
			);
		} else {
			send_key_press(e.key == "a" ? "ArrowLeft" : "ArrowRight");
		}
	} else if (e.key == "A" || e.key == "S") {
		send_key_press(e.key == "A" ? "ArrowDown" : "ArrowUp");
	} else if (e.key == "c") {
		// svg-icon 控制字幕打开与关闭
		// -subtitle 控制字幕管理菜单
		// 这里实现: 开关字幕但不显示菜单
		document
			.querySelector(".bpx-player-ctrl-subtitle .bpx-common-svg-icon")
			.click();
		document.querySelector(".bpx-player-ctrl-subtitle").click();
	} else if (e.key == "q") {
		// ctrl+q is reserved
		if (e.ctrlKey) {
			return;
		}

		// only work for single q press

		e.stopPropagation();

		send_key_press("d");
		setTimeout(() => {
			send_key_press("d", "keyup");
		}, 100);
	}
}


export function bili_keys_up(e) {
	if (e.key == "a" || e.key == "s") {
		send_key_press(e.key == "a" ? "ArrowLeft" : "ArrowRight", "keyup");
	}
}
