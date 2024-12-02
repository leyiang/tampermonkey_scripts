import { disableHover } from "./disable_hover";
import { disableEnterKey } from "./disable_enter";
import { insertButton } from "./insert_button";
import { inputBlur } from "./input_blur";
import { insertRandomButton } from "./insert_random_button";
import { updateRole } from "./update_role";
import { fix_input_selection } from "./fix_input_selection";
import { listenForDOM, slog, center_player, listenForDOM_a, newEl } from "../utils/utils";
import { hijack_comp } from "./hijack_web_comp";

function setWidescreen() {
	listenForDOM(".bpx-player-ctrl-wide", (el) => {
		if (!document.fullscreenElement) {
			el.click();
		}
	});
}

function hijack(element) {
	Object.defineProperty(element, "scrollTop", {
		get: function () {
			return this._scrollTop || 0; // 返回实际的 scrollTop 值
		},
		set: function (value) {
			console.log(`Trying to set scrollTop to ${value}`);
			alert("blocked");
		},
		configurable: true,
		enumerable: true,
	});
}

function disable_modify_scrolltop() {
	// hijack(document.body);
	// hijack(document.documentElement);

	// 选择你想要监控的元素
	const element = document.body;

	// @ts-ignore
	Element.prototype.old_scroll = Element.prototype.scrollIntoView;;

	// @ts-ignore
	window.old_scroll_to = window.scrollTo;

	document.body.scrollTo = window.scrollTo = () => {
		slog("scrollTo disabled");
	};

	Element.prototype.scrollTo = function () {
		slog("scrollTo is disabled");
	};

	Element.prototype.scrollIntoView = function () {
		slog("scrollIntoView is disabled.");
	};
}

(function () {
	"use strict";

	hijack_comp();

	/* Disable Enter Key */
	disableEnterKey();

	/* Disable El Hover */
	disableHover();

	/* Default Wide Screen */
	setWidescreen();

	/* 随即播放按钮 - 稍后再看页面 */
	insertRandomButton();

	inputBlur();

	updateRole();

	disable_modify_scrolltop();

	/* Insert Buttons */
	insertButton();

	fix_input_selection();
})();
