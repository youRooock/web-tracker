import { updateVisitCountForUrl, setActiveUrl, trackElapsedTime, deactivateActiveUrl } from "./userActivity.js";

var date = Date.now();
let allWindowsClosed = false;

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (allWindowsClosed) {
    date = Date.now();
    allWindowsClosed = !allWindowsClosed;
  }
  if (details.frameId == 0) {
    // handle cases with empty new tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => { });

    var timeInSeconds = (Date.now() - date) / 1000;

    await trackElapsedTime(Math.round(timeInSeconds));
    date = Date.now();
    await updateVisitCountForUrl(getHostName(details.url));
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    if (tabs[0].url) {
      const timeInSeconds = (Date.now() - date) / 1000;
      await trackElapsedTime(Math.round(timeInSeconds));
      await setActiveUrl(getHostName(tabs[0].url));
      date = Date.now();
    }
  });
});

// handle last tab close with multiple windows
// switch to last window active tab
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs.length == 0) {
      chrome.tabs.query({ active: true, lastFocusedWindow: false }, async (tabs) => {
        if (tabs.length != 0 && tabs[tabs.length - 1].url) {
          const timeInSeconds = (Date.now() - date) / 1000;
          await trackElapsedTime(Math.round(timeInSeconds));
          await setActiveUrl(getHostName(tabs[0].url));
          date = Date.now();
        }
      });
    }
  });

  // handle all windows close
  chrome.tabs.query({}, async (tabs) => {
    if (tabs.length == 0 && !allWindowsClosed) {
      allWindowsClosed = true;
      const timeInSeconds = (Date.now() - date) / 1000;
      await trackElapsedTime(Math.round(timeInSeconds));
      await deactivateActiveUrl();
    }
  });
});

const getHostName = url => {
  return new URL(url).hostname;
};
