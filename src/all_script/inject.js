export function injectUtils() {
	function test(el, from = "title") {
		const list = [];
		el.querySelectorAll("a").forEach(a => {
			const raw = a[from] + "##" + a.href;
			list.push(raw);
		});
		console.log(list.join('\n'));
	}

	//@ts-ignore
	window.test = test;
}
