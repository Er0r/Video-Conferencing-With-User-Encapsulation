const loginname = document.getElementById('loginname');
const logoutbtn = document.getElementById('logoutbtn');
var adminref = firebase.database().ref('/login/admin');


var email = "";
function readAll() {
    var token = sessionStorage.getItem('email');
    if(!token) 
        location.replace(`${window.origin}`);
    else 
        loginname.innerHTML = `Welcome <strong> ${sessionStorage.getItem('email')} </strong> <span class="pl-2">|</span> `
   
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
        
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) 
                window.indexedDB.deleteDatabase(r[i].name);
            
        }).then(() => {
            adminref.on('value', function(snapshot){
                snapshot.forEach((childSnapshot)=>{
                    if(childSnapshot.val().email === sessionStorage.getItem('email')) {
                        firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                            count: 0
                        });
                        sessionStorage.clear('email');
                        sessionStorage.clear('status');
                        alertify.success('Signout Successfully');
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
}
logoutbtn.addEventListener('click', logoutprocedure);

readAll();