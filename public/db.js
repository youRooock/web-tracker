let db;
let dbReq = indexedDB.open("web-tracker-db", 1);
const linksStore = "web-links";
dbReq.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore(linksStore, { keyPath: "date" });
};
dbReq.onsuccess = event => {
  db = event.target.result;
}

export const update = entity => {
  return new Promise(resolve => {
    const request = getStore(linksStore).put(entity);
    handleRequestEvents(request, resolve);
  });
};

export const get = key => {
  return new Promise(resolve => {
    const request = getStore(linksStore).get(key);
    handleRequestEvents(request, resolve);
  });
};

export const create = entity => {
  return new Promise(resolve => {
    const request = getStore(linksStore).add(entity);
    handleRequestEvents(request, resolve);
  });
};

export const remove = key => {
  return new Promise(resolve => {
    const request = getStore(linksStore).delete(key);
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
