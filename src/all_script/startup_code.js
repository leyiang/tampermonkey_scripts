import { is_host } from "../utils/url_check";
import { listenForDOM, newEl, slog } from "../utils/utils";

export function start_up() {
	/**
	 * 自动focus textarea
	 */
	if( is_host("tongyi") ) {
		const el = document.querySelector("textarea");
		el.focus();
	}

	if( is_host("dig") ) {
		const form = document.querySelector("form");
		const btn = newEl(`<button class="my-btn" type="button">Copy</button>`);
		form.appendChild( btn );


		const links = [];

		btn.addEventListener("click", e => {
			document.querySelectorAll(".one_result").forEach( wrap => {
				const a = wrap.querySelector('.fa-magnet a');

				if( a instanceof HTMLAnchorElement ) {
					links.push( a.href );
				}
			});

			const raw = links.join("\n")

			navigator.clipboard.writeText( raw );
			console.log( raw );
		});
	}


	if( window.location.href == "https://acnbayw2n3co.feishu.cn/share/base/form/shrcneL7i5ttzjnbUJiVyaZLJag" ) {
		slog("Weight 自动Focus");

		listenForDOM(".adit-container", el => {
			el?.focus();
			console.log("Focus Input successfully");
		}, 100);
	}
}
