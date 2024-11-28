export function slog(...args) {
	console.log("%c" + "[SBili]", "color:red;font-weight:bold;");
	console.log("[SBili] ", ...args);
}

export function listenForDOM(sel, cb, tryCount = 0) {
	if (tryCount > 20) return;

	const el = document.querySelector(sel);

	if (el && el instanceof HTMLElement) {
		slog("[BILI], Got el", el);
		cb?.(el);
	} else {
		setTimeout(() => listenForDOM(sel, cb, tryCount + 1), 1000);
	}
}

export function parseTime(strTime = "00:00") {
	const info = strTime
		.split(":")
		.map((s) => Number(s))
		.reverse();
	let res = 0;

	res += info[0];
	res += info[1] * 60;

	return res;
}

export function getRandomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function newButtonNode(title) {
	const button = document.createElement("button");
	button.innerText = title;
	return button;
}

export function center_player() {
	const el = document.querySelector("video");
	slog("vvv", el);

	setTimeout(() => {
		el.old_scroll({
			behavior: "auto",
			block: "center",
			inline: "center",
		});
	}, 100);
	// window.scrollTo(0, 70);
}

export function newEl(inner) {
	const div = document.createElement("div");
	div.innerHTML = inner;
	return div.firstElementChild;
}
