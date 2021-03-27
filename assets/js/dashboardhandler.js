const loginname = document.getElementById('loginname');

function readAll() {
    const request = window.indexedDB.open("firebaseLocalStorageDb", 1);
    request.onerror = function (event) {
        console.err("error fetching data", event);
    };
    request.onsuccess = function (dbEvent) {
        const db = request.result;
        const transaction = db.transaction(["firebaseLocalStorage"]);
        const objectStore = transaction.objectStore("firebaseLocalStorage");
        if ('getAll' in objectStore) {
            objectStore.getAll().onsuccess = function (getAllEvent) {
                loginname.innerHTML = `Welcome <strong> ${getAllEvent.target.result[0].value.email} </strong> <span class="pl-2">|</span> `
            };
        }
    };
}

readAll();