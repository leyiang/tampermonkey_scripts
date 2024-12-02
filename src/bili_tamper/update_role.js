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
		".b-img__inner img",
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
			el.setAttribute("tabindex", "2");
		});

		document.querySelectorAll(".fold-text").forEach((el) => {
			el.setAttribute("tabindex", "0");
		});

		
	}

	const id = setInterval(() => {
		update(document);
	}, 500);

	setTimeout(() => {
		clearInterval(id);

		document.addEventListener("DOMNodeInserted", (e) => {
			if (e.target instanceof HTMLElement) {
				update(e.target.parentNode);
			}
		});
	}, 2000);
}
