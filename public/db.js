let db;
let dbReq = indexedDB.open("web-tracker-db", 1);
dbReq.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("web-links-count", { keyPath: "date" });
};
dbReq.onsuccess = event => {
  db = event.target.result;
};

const insert = url => {
  const date = new Date();
  const today =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  const tx = db.transaction(["web-links-count"], "readwrite");
  const store = tx.objectStore("web-links-count");
  const getRequest = store.get(today);

  getRequest.onsuccess = () => {
    const data = getRequest.result;

    if (data) {
      var searchObject = data.urls.find(x => x.url == url);

      if (searchObject) {
        searchObject.count++;
        store.put({ 
          date: today, 
          urls: data.urls 
        });
      } else {
        data.urls.push({ url: url, count: 1 });
        store.put({
          date: today,
          urls: data.urls
        });
      }
    } else {
      store.add({ 
        date: today, 
        urls: [{ url: url, count: 1 }] });
    }
  };
};

export default insert;
