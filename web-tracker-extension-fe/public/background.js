import authenticatedXhr from "./authenticatedXhr.js";

chrome.webNavigation.onCompleted.addListener(details => {
  if (details.frameId == 0) {
    // handle cases with empty new tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      console.log("first navigation to " + getHostName(details.url));
    });

    authenticatedXhr({
      method: "POST",
      url: "http://localhost:5000",
      type: "application/x-www-form-urlencoded",
      body: "url=" + getHostName(details.url)
    });
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs[0].url) {
      console.log("activated " + getHostName(tabs[0].url));
    }
  });
});

// handle last tab close with multiple windows
// switch to last window active tab
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs.length == 0) {
      chrome.tabs.query({ active: true, lastFocusedWindow: false }, tabs => {
        if (tabs.length != 0 && tabs[tabs.length - 1].url) {
          console.log("activated " + getHostName(tabs[0].url));
        }
      });
    }
  });
});
// chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
//   sendResponse({ email: email });
// });


const getHostName = (url) => {
 return new URL(url).hostname;
}
