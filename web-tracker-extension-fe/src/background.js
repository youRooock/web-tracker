import authenticatedXhr from "./utils/authenticatedXhr";

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId == 0) {
    const url = new URL(details.url);

    authenticatedXhr('POST', 'http://localhost:5000', 'application/x-www-form-urlencoded', 'url=' + url.hostname);
  }
});

// chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
//   sendResponse({ email: email });
// });
