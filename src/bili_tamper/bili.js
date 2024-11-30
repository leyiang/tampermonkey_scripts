import { disableHover } from "./disable_hover";
import { disableEnterKey } from "./disable_enter";
import { insertButton } from "./insert_button";
import { inputBlur } from "./input_blur";
import { insertRandomButton } from "./insert_random_button";
import { updateRole } from "./update_role";
import { fix_input_selection } from "./fix_input_selection";
import { listenForDOM, slog, center_player, listenForDOM_a } from "../utils/utils";

function setWidescreen() {
	listenForDOM(".bpx-player-ctrl-wide", (el) => {
		if (!document.fullscreenElement) {
			el.click();

			if (document.documentElement.scrollTop < 690) {
				center_player();
			}
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

	document.body.scrollTo = window.scrollTo = () => {
		slog("scrollTo disabled");
	};

	Element.prototype.scrollTo = function () {
		slog("scrollTo is disabled");
	};

	const old_func = Element.prototype.scrollIntoView;

	Element.prototype.scrollIntoView = function () {
		slog("scrollIntoView is disabled.");
	};

	Element.prototype.old_scroll = old_func;
}

function hide_comment() {
	const style = document.createElement('style');
	style.textContent = `
		.bili-comments-bottom-fixed-wrapper {
			display: none !important;
		}
	`;

	// TODO: listenForShadow
	// listenForShadow(["bili-comments", "bili-comments-header-renderer"], el => {
	// 	el.shadowRoot.appendChild( style );
	// });

	listenForDOM("bili-comments", el => {
		listenForDOM_a("bili-comments-header-renderer", header => {
			header.shadowRoot.appendChild( style );
		}, el.shadowRoot);
	});
}

(function () {
	"use strict";

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

	hide_comment();
})();
