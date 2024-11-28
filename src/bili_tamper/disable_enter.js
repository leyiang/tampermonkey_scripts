import { slog } from "../utils/utils";

/**
 * disableEnterKey
 *
 * 有点忘记这个是干什么的了
 * 好像是防止focus到某个元素，然后按到回车
 */
export function disableEnterKey() {
	window.addEventListener(
		"keydown",
		(e) => {
			if (e.key === "Enter") {
				slog("Try to block enter");

				if (document.activeElement?.tagName === "INPUT") {
					// Allow Enter key to work in input
					return;
				}

				e.preventDefault();
				e.stopPropagation();
			}
		},
		true,
	);
}
