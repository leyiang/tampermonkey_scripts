import { newEl } from "../utils/utils"
import { MyBar } from "./bar-html";

// inject_css_file("https://local.lc/tampermonkey/style/bar_style.css")
customElements.define("my-bar", MyBar);

function insert_bar() {
	const bar = newEl(`
		<my-bar></my-bar>
	`);

	document.body.appendChild(bar);
}


document.addEventListener("keydown", e => {
	if (e.key === "o") {
		const tagName = document.activeElement?.tagName?.toLowerCase?.();

		if( document.fullscreenElement ) {
			return;
		}

		if (tagName === 'input' || tagName === 'textarea') {
			return;
		}

		if (e.metaKey) {
			return;
		}

		if (e.ctrlKey) {
			return;
		}

		setTimeout(() => {
			insert_bar();
		}, 50);
	}
});
