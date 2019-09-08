const authenticatedXhr = (method, url, type, body = null) => {
    var retry = true;
    const getTokenAndXhr = () => {
      chrome.identity.getAuthToken(
        {
          interactive: true
        },
        token => {
          console.log(token);
          if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
          }
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.setRequestHeader('Content-Type', type);
          xhr.setRequestHeader('Authorization', token);
          xhr.send(body);
  
          xhr.onload = function () {
            if (this.status === 401 && retry) {
              // This status may indicate that the cached
              // access token was invalid. Retry once with
              // a fresh token.
              retry = false;
              chrome.identity.removeCachedAuthToken(
                { 'token': token },
                getTokenAndXhr);
              return;
            }
          }
        });
    }
  
    getTokenAndXhr();
  }

  export default authenticatedXhr;