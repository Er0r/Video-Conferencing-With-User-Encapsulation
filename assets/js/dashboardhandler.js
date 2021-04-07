const loginname = document.getElementById('loginname');
const logoutbtn = document.getElementById('logoutbtn');
var adminref = firebase.database().ref('/login/admin');

function readAll() {
    var token = sessionStorage.getItem('email');
    if(!token) {
        location.replace(`${window.origin}`);
    }
    else 
        loginname.innerHTML = `Welcome <strong> ${sessionStorage.getItem('email')} </strong> <span class="pl-2">|</span> `
   
}

function logoutprocedure(){
    try{
        logout();
    }catch(err){
        alertify.error('Please Try Again Later');
    }
}

function logout() {
    var flag = 0;
    firebase.auth().signOut().then(() => {
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) 
                window.indexedDB.deleteDatabase(r[i].name);  
        })
        adminref.on('value', function(snapshot){
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().email === sessionStorage.getItem('email') && flag === 0 ) {
                    var random = childSnapshot.val().random;
                    firebase.database().ref('/login/admin/'+random).update({
                        count: 0
                    });
                    sessionStorage.clear('email');
                    sessionStorage.clear('status');
                    alertify.success('Signout Successfully');
                    flag = 1;
                    location.replace(`${location.origin}`);
                }
            })
        })
      }).catch((error) => {
        var errorMessage = error.message;
        alertify.error(`${errorMessage}`);
    });
}
logoutbtn.addEventListener('click', logoutprocedure);

readAll();