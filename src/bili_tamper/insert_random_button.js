import { getRandomItem, listenForDOM, newButtonNode } from "../utils/utils";

export function insertRandomButton() {
	listenForDOM(".watch-later-list", wrap => {
		const btn = newButtonNode("随机播放");
		btn.className = "s-btn";

		btn.addEventListener("click", () => {
			const list = wrap.querySelectorAll(".av-item");
			const toPlay = getRandomItem(list);

			const link = toPlay.querySelector(".t");
			const del = toPlay.querySelector(".btn-del");
			const bvid = link.href.split("/").pop();
			const newUrl = "https://www.bilibili.com/video/" + bvid;

			window.open(newUrl);
			del.click();
		});

		wrap.querySelector(".r-con").appendChild(btn);
	});
}
