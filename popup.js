document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('summarize').addEventListener('click', function () {
		document.getElementById('loading').style.display = 'block';

		// Get the current tab
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var tab = tabs[0];

			// Send a message to the content script to get the page content
			chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, function (response) {
				const content = response.content;
				chrome.storage.sync.get('apiKey', function (data) {
					const apiKey = data.apiKey;
					summarizePage(content, apiKey);
				});
			});
		});
		document.getElementById('ask').addEventListener('click', function () {
			document.getElementById('loading').style.display = 'block';

			// Get the current tab
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				var tab = tabs[0];

				// Send a message to the content script to get the page content
				chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, function (response) {
					const content = response.content;
					const question = document.getElementById('question').value
					chrome.storage.sync.get('apiKey', function (data) {
						const apiKey = data.apiKey;
						// You can now send the apiKey to your server or use it in other ways.
						askQuestion(content, question, apiKey);
					});
				});
			});
		});
	});
})

function summarizePage(content, apikey) {

	fetch('https://api.openai.com/v1/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apikey}`
		},
		body: JSON.stringify({
			model: 'text-davinci-003',
			prompt: `You are going to create 3 bullet points describing the content. It should be factual and useful. Also provide a reliability score. Please summarize the following text: ${content}. `,
			max_tokens: 1000,
			temperature: 0.2
		})
	})
		.then(response => response.json())
		.then(data => {
			document.getElementById('loading').style.display = 'none';
			document.getElementById('summary').innerText = data.choices[0].text;
		})
		.catch(error => {
			console.error(error);
			document.getElementById('loading').style.display = 'none';
		});
}

function askQuestion(content, question, apikey) {
	fetch('https://api.openai.com/v1/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apikey}`
		},
		body: JSON.stringify({
			model: 'text-davinci-003',
			prompt: `You are going to answer a user generated question based on some set content. The answer should be concise and clear. Answer this user question: ${question} \n\n Use this content as the primary knowledge base: ${content}\n\n`,
			max_tokens: 1000,
			temperature: 0.2
		})
	})
		.then(response => response.json())
		.then(data => {
			// Display the answer
			document.getElementById('answer').innerText = data.choices[0].text;
		})
		.catch(error => {
			console.error(error);
		});
}
