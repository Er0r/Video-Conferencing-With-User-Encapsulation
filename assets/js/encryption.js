function AdminvalidateToken(){
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
                if(!getAllEvent.target.result[0].value.email){
                    return false;
                }
            };
        }
        else if(sessionStorage.getItem('status') === 'admin') {
            return false;
        } else {
            return true;
        }
    }
}

function UservalidateToken(){
    const db = request.result;
    const transaction = db.transaction(["firebaseLocalStorage"]);
    const objectStore = transaction.objectStore("firebaseLocalStorage");
    if ('getAll' in objectStore) {
        objectStore.getAll().onsuccess = function (getAllEvent) {
            if(!getAllEvent.target.result[0].value.email){
                return false;
            }
        };
    }
    else if(sessionStorage.getItem('status') === 'admin') {
        return false;
    } else {
        return true;
    }
}

function MentorvalidateToken(){
    const db = request.result;
    const transaction = db.transaction(["firebaseLocalStorage"]);
    const objectStore = transaction.objectStore("firebaseLocalStorage");
    if ('getAll' in objectStore) {
        objectStore.getAll().onsuccess = function (getAllEvent) {
            if(!getAllEvent.target.result[0].value.email){
                return false;
            }
        };
    }
    else if(sessionStorage.getItem('status') === 'admin') {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    AdminvalidateToken: AdminvalidateToken,
    UservalidateToken: UservalidateToken,
    MentorvalidateToken: MentorvalidateToken
}