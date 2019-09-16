import {
  addOrUpdate,
  setElapsedTime,
  getPreviousActiveTab,
  setActiveTab
} from "./db.js";

var date = Date.now();
let allWindowsClosed = false;

chrome.webNavigation.onCompleted.addListener(details => {
  if (!allWindowsClosed) allWindowsClosed = !allWindowsClosed;
  if (details.frameId == 0) {
    // handle cases with empty new tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {});

    addOrUpdate(getHostName(details.url));
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs[0].url) {
      var timeInSeconds = (Date.now() - date) / 1000;
      getPreviousActiveTab().then(prevTab => {
        setElapsedTime(prevTab.url, timeInSeconds);
        setActiveTab(getHostName(tabs[0].url));
        date = Date.now();
      });
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
          var timeInSeconds = (Date.now() - date) / 1000;
          const prevTab = getPreviousActiveTab();
          setElapsedTime(prevTab.url, timeInSeconds);
          setActiveTab(getHostName(tabs[0].url));
          date = Date.now();
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
