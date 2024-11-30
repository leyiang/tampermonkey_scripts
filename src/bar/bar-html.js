import { newEl } from "../utils/utils";

// @ts-ignore
const open = (url) => {
	GM_openInTab(url, {
		active: true
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

		const my_list = {
			"gpt": "https://tongyi.aliyun.com/",
			"vim": "moz-extension://8138219b-7a99-436e-b611-80bbb88f5fc8/pages/options.html#",
			"tm": "moz-extension://e2ba28e5-894b-4737-822f-c8c13cb8234b/options.html#nav=cf710200-6756-4556-b97d-0a01b3a0dbc0+editor",
			"map": "https://www.desmos.com/calculator",
			"later": "https://www.bilibili.com/watchlater/#/list",
			"drive": "https://mypikpak.com/drive/all",
			"git": "https://github.com/leyiang",
			"weight": "https://acnbayw2n3co.feishu.cn/share/base/form/shrcneL7i5ttzjnbUJiVyaZLJag",
			"lrc": "https://local.lc/lrc/",
		};

		function parse_url(val) {
			const url = my_list[val];

			if (url) {
				open(url);
			} else {
				open("https://www.google.com/search?q=" + val);
			}
		}

		const close = () => this.remove();
		const input = shadow.querySelector("input");
		input.focus();
		
		const search_list = {
			b     : "https://search.bilibili.com/all?keyword=%s",
			d     : "https://duckduckgo.com/?q=%s DuckDuckGo",
			cam   : "https://www.britannica.com/dictionary/%s",
			y     : "https://www.youtube.com/results?search_query=%s",
			book  : "https://annas-archive.org/search?q=%s&ext=pdf&ext=epub",
			you   : "https://youdao.com/result?word=%s",
			zhihu : "https://www.zhihu.com/search?type=content&q=%s",
			dig   : "https://btdig.com/search?q=%s",
			163   : "https://music.163.com/#/search/m/?s=%s",
		};

		let to_search = null;

		function parse_search() {
			const search_template = search_list[to_search];

			if (search_template) {
				const query = encodeURIComponent(input.value);
				const url = search_template.replace("%s", query)

				open(url);
			}
		}

		function set_to_search() {
			to_search = input.value;
			const span = newEl(`<span>${input.value}</span>`);
			bar.insertBefore(span, input);
			input.value = "";
		}

		input.addEventListener("keydown", e => {
			e.stopPropagation();

			if (e.key === "Enter") {
				if (to_search) {
					parse_search();
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
