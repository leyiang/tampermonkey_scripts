import { is_host } from "../utils/url_check";
import { toggle_fullscreen } from "../utils/utils";
import { bili_keys, bili_keys_up } from "./bili_keys";
import { ytp_keys } from "./ytp_keys";

export function register_keyshortcuts() {
	document.addEventListener("keydown", e => {
		if (is_host("ytp")) ytp_keys(e);
		if (window.location.host.endsWith("bilibili.com") ) bili_keys(e);

		if (is_host("live_bili")) {
			if (e.key === "`") {
				toggle_fullscreen(
					document.querySelector("video")
				);
			}
		}

		if( is_host("drive") ) {
			if (e.key === "`") {
				document.querySelector(".el-button.el-button--primary").click();
			}
		}
	});

	document.addEventListener("keyup", e => {
		if (is_host("bili")) bili_keys_up(e);
	});
}

