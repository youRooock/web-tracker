import { create, get, update } from "./db.js";

export const trackElapsedTime = async (timeInSeconds) => {
    const today = getTodayDate();
    const entity = await get(today);

    if (entity) {
        const prev = entity.urls.find(x => x.isActive);
        if (prev) {
            prev.elapsedTime += timeInSeconds;
            await update(entity);
        }
    }
}

export const setActiveUrl = async (url) => {
    const today = getTodayDate();
    const entity = await get(today);

    if (entity) {
        resetActiveUrls(entity.urls);

        const curr = entity.urls.find(x => x.url == url);
        if (curr) {
            curr.isActive = true;
            await update(entity);
        } else {
            await updateVisitCountForUrl(url);
        }
    }
}

export const deactivateActiveUrl = async () => {
    const today = getTodayDate();
    const entity = await get(today);

    if (entity) {
        resetActiveUrls(entity.urls);
        await update(entity);
    }
}

export const updateVisitCountForUrl = async (url) => {
    const today = getTodayDate();

    const entity = await get(today);
    if (entity) {
        resetActiveUrls(entity.urls);
        const curr = entity.urls.find(x => x.url == url);

        if (curr) {
            curr.count++;
            curr.isActive = true;
        } else {
            entity.urls.push({ url: url, count: 1, elapsedTime: 0, isActive: true });
        }

        await update(entity);
    } else {
        await create({
            date: today,
            urls: [{ url: url, count: 1, elapsedTime: 0, isActive: true }]
        });
    }
}

const getTodayDate = () => {
    const date = new Date();
    return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
}

const resetActiveUrls = (urls) =>{
    const allActive = urls.filter(x => x.isActive);
    allActive.forEach(r => {
        r.isActive = false;
    });
}