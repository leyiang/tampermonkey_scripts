import { listenForDOM } from "../utils/utils";

export function updateRole() {
	const selectors = [
		".bili-dyn-action",
		".bili-rich-text-module.at",
		".video-pod__item",
		".toggle-btn",
		".bili-rich-text__action",
		".bili-dyn-up-list__item",
		".history-item",
	];

	selectors.forEach((selector) => {
		listenForDOM(selector, (_) => {
			document.querySelectorAll(selector).forEach((el) => {
				el.setAttribute("role", "button");
			});
		});
	});

	function update(el) {
		selectors.forEach((selector) => {
			el.querySelectorAll(selector).forEach((el) => {
				el.setAttribute("role", "button");
			});
		});

		document.querySelectorAll(".search-panel .clear").forEach((el) => {
			el.setAttribute("tabindex", "0");
		});

		document.querySelectorAll(".fold-text").forEach((el) => {
			el.setAttribute("tabindex", "0");
		});

		
	}

	const id = setInterval(() => {
		console.log(9999, "interval 123");
		update(document);
	}, 500);

	setTimeout(() => {
		clearInterval(id);

		document.addEventListener("DOMNodeInserted", (e) => {
			if (e.target instanceof HTMLElement) {
				console.log(9999, "inject 123");
				update(e.target);
			}
		});
	}, 2000);
}
