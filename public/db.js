const STORE_NAME = "web-links";
const DB_NAME = "web-tracker-db";
let db;
let dbReq = indexedDB.open(DB_NAME, 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore(STORE_NAME, { keyPath: "date" });
};
dbReq.onsuccess = event => {
  db = event.target.result;
}

export const update = entity => {
  return new Promise(resolve => {
    const request = getStore(STORE_NAME).put(entity);
    handleRequestEvents(request, resolve);
  });
};

export const get = key => {
  return new Promise(resolve => {
    const request = getStore(STORE_NAME).get(key);
    handleRequestEvents(request, resolve);
  });
};

export const create = entity => {
  return new Promise(resolve => {
    const request = getStore(STORE_NAME).add(entity);
    handleRequestEvents(request, resolve);
  });
};

export const remove = key => {
  return new Promise(resolve => {
    const request = getStore(STORE_NAME).delete(key);
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
