import { listenForDOM, slog } from "../utils/utils";

export function inputBlur() {
	function hideSearchSuggestion(hide = false) {
		const panel = document.querySelector(".search-panel");

		if (panel instanceof HTMLElement) {
			panel.style.display = hide ? "none" : "";
		}
	}

	listenForDOM(".nav-search-input", (el) => {
		el.addEventListener("blur", (e) => {
			if (
				e.type === "blur" &&
				e.relatedTarget &&
				e.relatedTarget.tagName !== "INPUT"
			) {
				slog("Click blur event", e.relatedTarget);
				return;
			}

			hideSearchSuggestion(true);
		});

		el.addEventListener("focus", () => {
			hideSearchSuggestion();
		});
	});

	Element.prototype.old_add_event = Element.prototype.addEventListener;
	Element.prototype.addEventListener = function(eventType, ...args) {
		const el = this;

		if( el.classList.contains("search-input-el") ) {
			// 不允许search-input-el 添加 blur event
			// 这里自定义了blur, 官方的会影响
			if( eventType == "blur" ) {
				// return;
			}
		}

		Element.prototype.old_add_event.call( this, eventType, ...args );
	}

	listenForDOM(".search-input-el", (el) => {
		el.old_add_event("blur", (e) => {
			if (
				e.type === "blur" &&
				e.relatedTarget &&
				e.relatedTarget.tagName !== "INPUT"
			) {
				slog("Click blur event", e.relatedTarget);
				return;
			}

			const panel = document.querySelector(".search-panel-popover");
			if (panel instanceof HTMLElement) {
				panel.style.display = "none";
			}
		});
	});
}
