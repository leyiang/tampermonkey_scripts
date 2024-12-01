import { listenForDOM_a } from "../utils/utils";

function wrap_comp(comp, onConnect) {
	const new_comp = class extends comp {
		connectedCallback() {
			if (super.connectedCallback) {
				super.connectedCallback();
			}

			if( this.shadowRoot	) {
				onConnect?.( this.shadowRoot );
			}
		}
	}

	return new_comp;
}

export function hijack_comp() {
	const comp_define = customElements.define;

	customElements.define = (name, comp, options) => {
		let new_comp = comp

		if( name == "bili-comment-pictures-renderer" ) {
			new_comp = wrap_comp( comp, (shadowRoot) => {
				listenForDOM_a("img", _ => {
					// 可能有多张图
					shadowRoot.querySelectorAll("img").forEach(img => {
						img.setAttribute("role", "button");
					});
				}, shadowRoot );
			});
		}

		if( name == "bili-comments-header-renderer" ) {
			const style = document.createElement('style');

			style.textContent = `
				.bili-comments-bottom-fixed-wrapper {
					display: none !important;
				}
			`;

			new_comp = wrap_comp( comp, (shadowRoot) => {
				shadowRoot.appendChild( style );
			});
		}

		comp_define.call(customElements, name, new_comp, options);
	}
}
