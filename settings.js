document.getElementById('save').addEventListener('click', function () {
	var apiKey = document.getElementById('apiKey').value;
	chrome.storage.sync.set({ 'apiKey': apiKey }, function () {
		alert('Settings saved');
	});
});

// Load existing API key if available
chrome.storage.sync.get('apiKey', function (data) {
	if (data.apiKey) {
		document.getElementById('apiKey').value = data.apiKey;
	}
});
