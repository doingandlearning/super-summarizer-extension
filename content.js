chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'getPageContent') {
		const content = document.body.innerText;
		console.log(content)
		sendResponse({ content: content });
	}
});