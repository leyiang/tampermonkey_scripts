import { is_host } from "../utils/url_check";

export function start_up() {
	/**
	 * 自动focus textarea
	 */
	if( is_host("tongyi") ) {
		const el = document.querySelector("textarea");
		el.focus();
	}
}
