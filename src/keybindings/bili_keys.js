import { slog, center_player, newEl, listenForDOM } from "../utils/utils";


function scrollDown(dy=100) {
	let currentScroll = window.scrollY || document.documentElement.scrollTop;
	window.old_scroll_to(0, currentScroll + dy);
}

const prev_timeout = [];

function showIndicator() {
	prev_timeout.forEach( id => clearTimeout(id) );
	prev_timeout.length = 0

	let el = document.querySelector(".my-indicator");

	if( ! el ) {
		el = newEl("<div class='my-indicator hide'>12:33</div>");

		listenForDOM(".bpx-player-video-area", wrap => {
			wrap.appendChild( el );
		});
	}

	const video = document.querySelector("video");

	el.classList.remove("hide");

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
		return `${minutes}:${secs}`;
	};

	const currentTime = video.currentTime;
 	const duration = video.duration;

    const raw = `${formatTime(currentTime)} / ${formatTime(duration)}`;
	el.textContent = raw;

	const timeout_id = setTimeout(() => {
		el.classList.add("hide");
	}, 800);

	prev_timeout.push( timeout_id );
}

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
	} else if (["a", "s", "h", "l"].includes(e.key)) {
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
			send_key_press( ["a", "h"].includes(e.key) ? "ArrowLeft" : "ArrowRight");
			showIndicator();
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


		// q => 开关弹幕
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

	if( e.key == "j" ) {
		send_key_press("ArrowDown");
	}

	if( e.key == "k" ) {
		send_key_press("ArrowUp");
	}

	if( e.key == ")" ) {
		document.querySelector("video").currentTime = 0;
		showIndicator();
	}


	// Esc 会退出宽屏模式
	// 这里屏蔽掉Esc，input 和 viumium 的 Esc 功能不受影响
	if( e.key === "Escape" ) {
		if( document.fullscreenElement?.tagName == "INPUT" ) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
	}


	// 拦截默认方向键, 添加小功能, 测试了不会死循环
	if( ["ArrowLeft", "ArrowRight"].includes(e.key) ) {
		send_key_press( e.key );
		showIndicator();
	}
}

export function bili_keys_up(e) {
	if (["a", "s", "h", "l"].includes(e.key)) {
		send_key_press(["a", "h"].includes(e.key) ? "ArrowLeft" : "ArrowRight", "keyup");
	}
}
