let db;
let dbReq = indexedDB.open("web-tracker-db", 1);
const linksStore = "web-links";
dbReq.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("web-links-count", { keyPath: "date" });
};
dbReq.onsuccess = event => {
  db = event.target.result;
};

export const addOrUpdate = url => {
  const today = getTodayDate();
  const request = getRecordRequest(today);

  request.onsuccess = () => {
    const data = request.result;

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
  const request = getRecordRequest(today);

  request.onsuccess = () => {
    const data = request.result;

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
    const request = getRecordRequest(today);

    request.onsuccess = () => {
      const data = request.result;

      if (data) {
        var searchObject = data.urls.find(x => x.isActive);

        if (searchObject) return resolve(searchObject);
      }
    };
  });
};

export const setActiveTab = url => {
  const today = getTodayDate();
  const request = getRecordRequest(today);
  request.onsuccess = () => {
    const data = request.result;

    if (data) {
      var searchObject = data.urls.find(x => x.isActive);
      searchObject.isActive = false;

      searchObject = data.urls.find(x => x.url == url);
      if (!searchObject) {
        searchObject.isActive = true;
      }

      store.put(data);
    }
  };
};

export const update = entity => {
  return new Promise(resolve => {
    const request = getStore().put(entity);
    handleRequestEvents(request, resolve);
  });
};

export const get = key => {
  return new Promise(resolve => {
    const request = getStore().get(key);
    handleRequestEvents(request, resolve);
  });
};

export const create = entity => {
  return new Promise(resolve => {
    const request = getStore().add(entity);
    handleRequestEvents(request, resolve);
  });
};

export const remove = key => {
  return new Promise(resolve => {
    const request = getStore().delete(key);
    handleRequestEvents(request, resolve);
  });
};

const handleRequestEvents = (request, callback) => {
  request.onsuccess = () => {
    return callback(request.result);
  };

  request.onerror = (e) => {
    console.log(e);
  };
}

const getStore = name => {
  const tx = db.transaction([name], "readwrite");
  return tx.objectStore(name);
};

const getTodayDate = () => {
  const date = new Date();
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};
