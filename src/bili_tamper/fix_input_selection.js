/**
 * @module
 *
 * fix_input_selection
 * B站的鬼才产品, focus 搜索框时会运行 setSelectionRange
 * 一点input光标就跳到最后
 *
 * 本函数功能:
 * 1. hijack setSelectionRange, 禁止光标变动
 * 2. blur时自动取消selection
 */

import { listenForDOM, slog } from "../utils/utils";

export function fix_input_selection() {
	listenForDOM(".search-input-el", (el) => {
		el.old_setSelectionRange = el.setSelectionRange;

		el.setSelectionRange = (...args) => {
			slog("888", args);
		};

		el.addEventListener("blur", () => {
			el.focus();
			var currentPos = el.selectionStart; // 获取当前光标位置
			el.setSelectionRange(currentPos, currentPos);
			el.old_setSelectionRange(currentPos, currentPos);
		});
	});
}
