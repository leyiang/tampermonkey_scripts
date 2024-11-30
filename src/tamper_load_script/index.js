import { createSlog, slog } from "../utils/utils";

const log = createSlog("exec_script")

function exec_script(path) {
	var nodeJSEndPoint = path + "?time=" + Date.now();
	log("准备执行脚本: ", nodeJSEndPoint);

	function evaluateScript(scriptContent) {
		// @ts-ignore
		GM_addElement("script", { textContent: scriptContent });
	}

	// Function to handle the GM_xmlhttpRequest response
	function handleResponse(response) {
		if (response.status === 200 && response.responseText) {
			log("获得200返回");
			evaluateScript(response.responseText);
		} else {
			log("请求错误", response.statusText);
		}
	}

	// Function to make the GM_xmlhttpRequest
	function makeRequest() {
		log("发送GET请求: ");

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
