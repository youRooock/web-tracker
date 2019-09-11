const authenticatedXhr = request => {
  var retry = true;
  const getTokenAndXhr = () => {
    chrome.identity.getAuthToken(
      {
        interactive: true
      },
      token => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open(request.method, request.url);
        xhr.setRequestHeader("Content-Type", request.type);
        xhr.setRequestHeader("Authorization", token);

        if (request.body) {
          xhr.send(request.body);
        } else {
          xhr.send();
        }

        xhr.onload = function() {
          if (this.status === 401 && retry) {
            // This status may indicate that the cached
            // access token was invalid. Retry once with
            // a fresh token.
            retry = false;
            chrome.identity.removeCachedAuthToken(
              { token: token },
              getTokenAndXhr
            );
            return;
          }
        };
      }
    );
  };

  getTokenAndXhr();
};

export default authenticatedXhr;
