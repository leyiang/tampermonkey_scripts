export function slog(...args) {
	console.log(
		"%c" + "[slog]", "color:red;font-weight:bold;",
		...args
	);
}

export function createSlog( tag="empty-tag" ) {
	return (...args) => {
		slog(`[${ tag }]`, ...args)
	}
}

// export function listenForShadow(comp_list, cb, pnode=document, tryCount = 0) {
// 	if (tryCount > 20) {
// 		return;
// 	}
//
// 	const el = pnode.querySelector(sel);
//
// 	if (el && el instanceof HTMLElement) {
// 		slog("[BILI], Got el", el);
// 		cb?.(el);
// 	} else {
// 		console.log( pnode, "retry" );
// 		setTimeout(() => listenForDOM_a(sel, cb, pnode, tryCount + 1), 100);
// 	}
//
// 	listenForDOM(" ", el => {
// 		listenForDOM_a("", header => {
// 		}, el.shadowRoot);
// 	});
// }

export function listenForDOM_a(sel, cb, pnode, tryCount = 0) {
	if (tryCount > 20) {
		return;
	}

	const el = pnode.querySelector(sel);

	if (el && el instanceof HTMLElement) {
		slog("[BILI], Got el", el);
		cb?.(el);
	} else {
		console.log( pnode, "retry" );
		setTimeout(() => listenForDOM_a(sel, cb, pnode, tryCount + 1), 100);
	}
}

export function listenForDOM(sel, cb, timeoutMS=1000, tryCount = 0) {
	if (tryCount > 20) return;

	const el = document.querySelector(sel);

	if (el && el instanceof HTMLElement) {
		slog("[listenForDOM]", "成功获取元素", el);
		cb?.(el);
	} else {
		setTimeout(() => listenForDOM(sel, cb, timeoutMS, tryCount + 1), timeoutMS);
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
		//@ts-ignore
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


export function toggle_fullscreen( el ) {
	document.fullscreenElement
		? document.exitFullscreen()
		: el.requestFullscreen();
}
