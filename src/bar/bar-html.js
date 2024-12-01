import { newEl, slog } from "../utils/utils";

// @ts-ignore
const open = (url) => {
	GM_openInTab(url, {
		active    : true,
		setParent : true
	});
}

function getData( cb ) {
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://local.lc/tampermonkey/links.json?time=" + Date.now(),
		onload: cb,
		// onerror: handleResponse,
	});
}
class MyBar extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: "open" });
		const style = document.createElement("style");

		style.textContent = `
		.my-bar {
			position: fixed;
			z-index: 2139999998;

			top: 70px;
			left: 50%;
			transform: translateX(-50%);
			width: 80%;

			padding: 10px;
			background: #EEE;
			box-shadow: 0 0 10px;
			border-radius: 8px;
			display: flex;
			gap: 1rem;
			align-items: center;
		}

		.my-bar span {
			background: lightblue;
			padding: .5rem;
			border-radius: 6px;
		}

		.my-bar input {
			flex: 1;
			display: flex;
			height: 40px;

			font-size: 20px;
			border-radius: 6px;
			border: 2px solid #bcbcbc;
			padding: 0 10px;
			box-sizing: border-box;
		}
    `;

		const bar = newEl(`
		<div class='my-bar'>
			<input type="text" auto-focus />
		</div>
	`);

		shadow.appendChild(bar);
		shadow.appendChild(style);

		let val = "";

		let my_list = {};
		let search_list = {};

		getData( r => {
			r = JSON.parse(r.responseText ?? "{}");
			my_list = r["my_list"] ?? {};
			search_list = r["search_list"] ?? {};
		});

		function parse_url(val) {
			const url = my_list[val];

			if (url) {
				open(url);
			} else {
				const search_template = search_list[val];
				slog("no url")

				if( search_template ) {
					to_search = val;
					slog("got search_template")
					setTimeout(() => {
						if( clip ) {
							slog("got clipboard", clip)
							parse_search( clip )
							clip = null;
						} else {
							slog("no clipboard", clip)
							open("https://www.google.com/search?q=" + val);
						}
					}, 50);
				} else {
					open("https://www.google.com/search?q=" + val);
				}
			}
		}

		const close = () => this.remove();
		const input = shadow.querySelector("input");
		input.focus();
		
		let to_search = null;
		let clip = null;

		function parse_search( val ) {
			const search_template = search_list[to_search];

			if (search_template) {
				const query = encodeURIComponent( val );
				const url = search_template.replace("%s", query)

				open(url);
			}
		}

		function set_to_search() {
			to_search = input.value;
			const span = newEl(`<span>${ to_search }</span>`);
			bar.insertBefore(span, input);
			input.value = "";
		}

		input.addEventListener("keydown", e => {
			e.stopPropagation();

			if (e.key === "Enter") {
				navigator.clipboard.readText().then(content => {
					clip = content;
				});

				if (to_search) {
					parse_search( input.value );
				} else {
					parse_url(input.value);
				}
				input.value = "";
				close();
			}

			if (e.key === "Tab") {
				e.preventDefault();

				if (input.value in search_list) {
					set_to_search();
				}
			}

			if( e.key == "[" ) {
				close();
			}

			if (e.key === "Backspace") {
				if (e.ctrlKey) {
					shadow.querySelector("span").remove();
				} else if (input.value == "") {
					shadow.querySelector("span").remove();
				}
			}

			if ( e.key === " " ) {
				if( input.value in search_list ) {
					e.preventDefault();
					set_to_search();
				}
			}

			return false;
		});

		input.addEventListener("blur", () => {
			close();
		});
	}
}

export { MyBar };
