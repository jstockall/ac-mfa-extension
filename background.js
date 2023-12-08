
chrome.runtime.onInstalled.addListener(() => {
	console.log("Background script installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "getAuthToken") {
		chrome.identity.getAuthToken({ interactive: true }, (token) => {
			sendResponse({ token });
		});
		return true; // Indicates that the response will be sent asynchronously
	}
});