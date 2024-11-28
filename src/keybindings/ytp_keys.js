export function ytp_keys(e) {
	document.addEventListener('keydown', (e) => {
        if (e.key === "`") {
            document.querySelector(".ytp-fullscreen-button").click()
        }
	});
}
