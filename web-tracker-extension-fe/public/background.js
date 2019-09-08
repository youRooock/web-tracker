import authenticatedXhr from "./authenticatedXhr.js";

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId == 0) {
    const url = new URL(details.url);
 
    // handle cases with empty new tab
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true },
      (tabs) => {
        console.log("activated " + tabs[0].url);
      });

    authenticatedXhr('POST', 'http://localhost:5000', 'application/x-www-form-urlencoded', 'url=' + url.hostname);
  }
});

chrome.tabs.onActivated.addListener((details) => {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true },
    (tabs) => {
      if (tabs[0].url) console.log("activated " + tabs[0].url);
    });
});

// handle last tab close with multiple windows
chrome.tabs.onRemoved.addListener((details) => {

  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': false },
    (tabs) => {
      if (tabs.length != 0) console.log('activated ' + tabs[0].url);
    });

});
// chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
//   sendResponse({ email: email });
// });
