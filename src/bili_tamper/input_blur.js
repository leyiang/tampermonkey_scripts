import { listenForDOM, slog } from "../utils/utils";

export function inputBlur() {
	function hideSearchSuggestion(hide = false) {
		const panel = document.querySelector(".search-panel");

		if (panel instanceof HTMLElement) {
			panel.style.display = hide ? "none" : "";
		}
	}

	listenForDOM(".nav-search-input", el => {
		el.addEventListener("blur", (e) => {
			if (e.type === 'blur' && e.relatedTarget && e.relatedTarget.tagName !== "INPUT") {
				slog('Click blur event', e.relatedTarget);
				return;
			}

			hideSearchSuggestion(true);
		});

		el.addEventListener("focus", () => {
			hideSearchSuggestion();
		});
	});

	listenForDOM(".search-input-el", el => {
		el.addEventListener("blur", (e) => {
			if (e.type === 'blur' && e.relatedTarget && e.relatedTarget.tagName !== "INPUT") {
				slog('Click blur event', e.relatedTarget);
				return;
			}

			const panel = document.querySelector(".search-panel-popover");
			if (panel instanceof HTMLElement) {
				panel.style.display = "none";
			}
		});
	});
}
