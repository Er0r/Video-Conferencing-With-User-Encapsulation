import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAUCgn__4r9gxa1nIHWuibSz-NxzdeEofw",
    authDomain: "ishwarsingh-fe6da.firebaseapp.com",
    projectId: "ishwarsingh-fe6da",
    storageBucket: "ishwarsingh-fe6da.appspot.com",
    messagingSenderId: "113178540955",
    appId: "1:113178540955:web:f443106593679e5c937f3e",
    measurementId: "G-NGDRDVFQ7S"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


function AdminvalidateToken(email){;
    adminref.once('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().email === sessionStorage.getItem('email')){ 
                if(childSnapshot.val().count > 0) {
                    return true;
                }
            } 
        })
    })

    if(sessionStorage.getItem('status') !== 'admin' && !email) {
        return false;
    } 
    return false;
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