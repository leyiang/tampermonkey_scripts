import { listenForDOM, slog } from "../utils/utils";

/**
 * @param {HTMLElement} el HTML Element to disable hover.
 *
 * 禁用元素 JS Hover
 * B站播放器各种控件（分享、弹幕设置..) 都有Hover弹窗
 * 非常影响操作, 这里禁止掉
 */
export function disableElHover(el) {
	slog("Try to disable: ", el);

	let allowHover = false;
	let open = true;

	el.addEventListener("mouseenter", e => {
		// Click stimulate hover event
		if (allowHover) return;
		e.stopPropagation();
	}, true);

	el.addEventListener("mouseleave", e => {
		if (allowHover) return;
		e.stopPropagation();
	}, true);

	el.addEventListener("click", _ => {
		const hoverEvent = document.createEvent("MouseEvents");
		hoverEvent.initMouseEvent(open ? "mouseenter" : "mouseleave");
		open = !open;

		allowHover = true;

		setTimeout(() => {
			allowHover = false;
		}, 100);

		el.dispatchEvent(hoverEvent);
	});
}


const sel_list = [
	".up-info--left",
	".up-detail-top",
	".bpx-player-ctrl-quality",
	".bpx-player-ctrl-playbackrate",
	".bpx-player-ctrl-subtitle",
	".bpx-player-ctrl-volume",
	".bpx-player-ctrl-setting",
	".bpx-player-video-btn-dm",
	".bpx-player-dm-setting",
];

export function disableHover() {
	slog("Try to disable hover");

	sel_list.forEach(sel => {
		listenForDOM(sel, el => {
			disableElHover(el);
		});
	});
}
