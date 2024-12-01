import { is_host } from "../utils/url_check";

function inject_css_file(file_path) {
	let link = document.createElement("link");
	link.href = file_path;
	link.rel = "stylesheet";
	document.head.append(link);
}

function get_path(file_name) {
	return "https://local.lc/tampermonkey/style/" + file_name;
}

export function inject_style() {
	if (is_host("bili")) {
		inject_css_file(get_path("bili_style.css"));
	}

	if (is_host("ytp")) {
		inject_css_file(get_path("ytp_style.css"));
	}

	if (is_host("tongyi")) {
		inject_css_file(get_path("tongyi_style.css"));
	}
}
