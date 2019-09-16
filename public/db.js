let db;
let dbReq = indexedDB.open("web-tracker-db", 1);
dbReq.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("web-links-count", { keyPath: "date" });
};
dbReq.onsuccess = event => {
  db = event.target.result;
};

export const addOrUpdate = url => {
  const today = getTodayDate();

  const tx = db.transaction(["web-links-count"], "readwrite");
  const store = tx.objectStore("web-links-count");
  const getRequest = store.get(today);

  getRequest.onsuccess = () => {
    const data = getRequest.result;

    if (data) {
      var searchObject = data.urls.find(x => x.isActive);
      searchObject.isActive = false;
      searchObject = data.urls.find(x => x.url == url);

      if (searchObject) {
        searchObject.count++;
        searchObject.isActive = true;
        store.put({
          date: today,
          urls: data.urls
        });
      } else {
        data.urls.push({ url: url, count: 1, elapsedTime: 0, isActive: true });
        store.put({
          date: today,
          urls: data.urls
        });
      }
    } else {
      store.add({
        date: today,
        urls: [{ url: url, count: 1, elapsedTime: 0, isActive: true }]
      });
    }
  };
};

export const setElapsedTime = (url, elapsedTime) => {
  const today = getTodayDate();

  const tx = db.transaction(["web-links-count"], "readwrite");
  const store = tx.objectStore("web-links-count");
  const getRequest = store.get(today);

  getRequest.onsuccess = () => {
    const data = getRequest.result;

    if (data) {
      var searchObject = data.urls.find(x => x.url == url);

      if (searchObject) {
        searchObject.elapsedTime += elapsedTime;
        store.put(data);
      }
    }
  };
};

export const getPreviousActiveTab = () => {
  return new Promise(resolve => {
    const today = getTodayDate();

    const tx = db.transaction(["web-links-count"], "readwrite");
    const store = tx.objectStore("web-links-count");
    const getRequest = store.get(today);

    getRequest.onsuccess = () => {
      const data = getRequest.result;

      if (data) {
        var searchObject = data.urls.find(x => x.isActive);

        if (searchObject) return resolve(searchObject);
      }
    };
  });
};

export const setActiveTab = url => {
  const today = getTodayDate();

  const tx = db.transaction(["web-links-count"], "readwrite");
  const store = tx.objectStore("web-links-count");
  const getRequest = store.get(today);

  getRequest.onsuccess = () => {
    const data = getRequest.result;

    if (data) {
      var searchObject = data.urls.find(x => x.isActive);
      searchObject.isActive = false;

      searchObject = data.urls.find(x => x.url == url);
      searchObject.isActive = true;

      store.put(data);
    }
  };
};

const getTodayDate = () => {
  const date = new Date();
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};
