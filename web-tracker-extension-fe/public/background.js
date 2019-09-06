chrome.identity.getAuthToken(
  {
    interactive: true
  },
  token => {
    if (chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
      return;
    }

    (async () => {
      const resp = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
          token
      );
      var user = await resp.json();
      alert(user.email);

      email = user.email;
    })();
  }
);

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ email: email });
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if(details.frameId == 0) {
    const url = new URL(details.url);
    console.log(url.hostname);
  }
});

var currentURL = null;
var email = null;
