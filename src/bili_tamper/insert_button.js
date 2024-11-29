import {
	listenForDOM,
	newButtonNode,
	parseTime,
	slog,
	newEl,
} from "../utils/utils";

function getTime() {
	const el = document.querySelector(".bpx-player-ctrl-time-current");
	if (!el) throw "Time el not found";

	const raw = el.textContent;
	const sec = parseTime(raw);

	const url = new URL(window.location.href);
	const search = new URLSearchParams(window.location.search);

	search.set("t", sec.toString());
	url.search = search.toString();

	const ref = url.toString();
	slog("Ref url: " + ref);
	navigator.clipboard.writeText(ref);
}

//

function is_24_search_rule() {
	const search = new URLSearchParams(window.location.search);

	if (search.get("order") !== "click") return false;

	const start_s = Number(search.get("pubtime_begin_s"));
	const end_s = Number(search.get("pubtime_end_s"));

	// 24 hour = 86400 sec
	if (end_s - start_s !== 86400) return false;

	const cur_s = Math.floor(new Date().getTime() / 1000);

	if (Math.floor(cur_s - end_s) > 300) return false;

	return true;
}

export function insertButton() {
	listenForDOM(".video-info-detail-list", (wrap) => {
		const btn = newButtonNode("Get Ref URL");
		btn.addEventListener("click", getTime);

		// 貌似B站会自动替换Header （什么鬼操作
		// 如果直接添加Button会让B站代码出问题（Header空白
		// 添加500ms延迟以规避
		setTimeout(() => {
			wrap.appendChild(btn);
		}, 6000);
	});

	listenForDOM(".conditions-order .search-condition-row", (wrap) => {
		const active = is_24_search_rule() ? "vui_button--active" : "";

		const btn = newEl(
			`<button class="vui_button vui_button--tab mr_sm">24小时最多播放</button>`,
		);

		function updateActive(btn) {
			if( is_24_search_rule() ) {
				btn.classList.add("vui_button--active");
			} else {
				btn.classList.remove("vui_button--active");
			}
		}

		updateActive( btn );
		wrap.appendChild(btn);

		btn.addEventListener("click", (e) => {
			const url = new URL(window.location);
			const search = new URLSearchParams(url.search);

			const date = new Date();

			// date.setHours(0);
			// date.setMinutes(0)
			// date.setSeconds(0)
			//
			// const start_s = Math.floor( date.getTime() / 1000 );
			//
			// date.setDate( date.getDate() + 1 )
			// const end_s   = Math.floor( date.getTime() / 1000 ) - 1;
			//

			const end_s = Math.floor(date.getTime() / 1000);
			date.setDate(date.getDate() - 1);
			const start_s = Math.floor(date.getTime() / 1000);

			slog(start_s, end_s);

			search.set("order", "click");
			search.set("pubtime_begin_s", start_s.toString());
			search.set("pubtime_end_s", end_s.toString());

			url.search = search.toString();

			window.location.href = url.toString();
		});

		const btn_a = newEl(
			`<button class="vui_button vui_button--tab mr_sm">清除排序</button>`,
		);

		btn_a.addEventListener("click", (e) => {
			const url = new URL(window.location);
			const search = new URLSearchParams(url.search);

			search.delete("order");
			search.delete("pubtime_begin_s");
			search.delete("pubtime_end_s");

			url.search = search.toString();
			window.location.href = url.toString();
		});
		wrap.appendChild(btn_a);
	});
}
