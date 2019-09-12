import insert from "./db.js";

let allWindowsClosed = false;

chrome.webNavigation.onCompleted.addListener(details => {
  if (!allWindowsClosed) allWindowsClosed = !allWindowsClosed;
  if (details.frameId == 0) {
    // handle cases with empty new tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      console.log("first navigation to " + getHostName(details.url));
    });

    insert(getHostName(details.url));
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

  chrome.tabs.query({}, tabs => {
    if (tabs.length == 0 && !allWindowsClosed) {
      allWindowsClosed = true;
    }
  });
});

const getHostName = url => {
  return new URL(url).hostname;
};
