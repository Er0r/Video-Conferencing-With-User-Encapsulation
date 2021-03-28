const loginname = document.getElementById('loginname');
const logoutbtn = document.getElementById('logoutbtn');
var adminref = firebase.database().ref('/login/admin');


var email = "";
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
                email = getAllEvent.target.result[0].value.email;
            };
        }
    };
}

function logoutprocedure(){
    try{
       
    }catch(err){
        alertify.error('Please Try Again Later');
    }
    finally{
        logout();
    }
    
}

function logout() {
    
    firebase.auth().signOut().then(() => {
        alertify.success('Signout Successfully');
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) 
                window.indexedDB.deleteDatabase(r[i].name);
            
        }).then(() => {
            adminref.on('value', function(snapshot){
                snapshot.forEach((childSnapshot)=>{
                    if(childSnapshot.val().email === email) {
                        firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                            count: 0
                        });
                        location.replace(`${location.origin}`);
                    }
                })
            })
            
        }).catch((error) => {
            alertify.error('Please Try Again Later');
        });
        
      }).catch((error) => {
        alertify.error('Please Try Again Later');
    });
    location.replace(`${location.origin}`);
}
logoutbtn.addEventListener('click', logoutprocedure);

readAll();