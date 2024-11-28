import { slog } from "../utils/utils";

function exec_script(path) {
	var nodeJSEndPoint = path + "?time=" + Date.now();
	slog("start");

	function evaluateScript(scriptContent) {
		// @ts-ignore
		GM_addElement("script", { textContent: scriptContent });
	}

	// Function to handle the GM_xmlhttpRequest response
	function handleResponse(response) {
		slog("on load");
		if (response.status === 200 && response.responseText) {
			evaluateScript(response.responseText);
		} else {
			slog("Error Loading NodeJS Script: ", response.statusText);
		}
	}

	// Function to make the GM_xmlhttpRequest
	function makeRequest() {
		slog("make request");

		// @ts-ignore
		GM_xmlhttpRequest({
			method: "GET",
			url: nodeJSEndPoint,
			onload: handleResponse,

			onerror: handleResponse,
		});
	}

	makeRequest();
}
