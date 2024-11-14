function exec_script(path) {
	var nodeJSEndPoint = path + '?time=' + Date.now();
			console.log('[test] start');

	// Function to evaluate the fetched script
	function evaluateScript(scriptContent) {
        console.log( scriptContent );
		eval(scriptContent);
	}

	// Function to handle the GM_xmlhttpRequest response
	function handleResponse(response) {
        			console.log('[test] on load');
		if (response.status === 200 && response.responseText) {
			evaluateScript(response.responseText);
		} else {
			console.log('[test] Error loading Node.JS Script:', response.statusText);
		}
	}

	// Function to make the GM_xmlhttpRequest
	function makeRequest() {
			console.log('[test] make request');
		GM_xmlhttpRequest({
			method: 'GET',
			url: nodeJSEndPoint,
			onload: handleResponse,
			onerror: handleResponse
		});
	}

    makeRequest();
}
