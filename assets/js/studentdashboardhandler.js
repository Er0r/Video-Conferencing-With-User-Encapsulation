var logoutbtn = document.getElementById('logoutbtn');


window.onload = function showData() {
    var count = 2;
    var marquee_contain = document.getElementById('marquee_contain');
    firebase.database().ref('/login/admin/notice').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=> {
            var newnotice = document.createElement('div');
            newnotice.id = `notice-${count}`;
            newnotice.className = "bg-light p-2 h5 font-weight-bold";
            newnotice.style = "color: #7b99ec"
            newnotice.innerHTML = `
                ${childSnapshot.val().notice}
            `
            marquee_contain.appendChild(newnotice);
            count++;
        })
    })
}


logoutbtn.addEventListener('click', ( e ) => {
    e.preventDefault();

})


function logout() {
    
    firebase.auth().signOut().then(() => {
        
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) 
                window.indexedDB.deleteDatabase(r[i].name);
            
        }).then(() => {
            firebase.database().ref('/login/user/').on('value', function(snapshot){
                snapshot.forEach((childSnapshot)=>{
                    if(childSnapshot.val().email === sessionStorage.getItem('email')) {
                        firebase.database().ref('/login/user/'+childSnapshot.val().random).update({
                            count: 0
                        });
                        sessionStorage.clear('email');
                        sessionStorage.clear('status');
                        alertify.success('Signout Successfully');
                        location.replace(`${location.origin}/studentlogin`);
                    }
                })
                alert('ok logout');
            })
            
        }).catch((error) => {
            alertify.error('Please Try Again Later');
        });
        
      }).catch((error) => {
        alertify.error('Please Try Again Later');
    });
}
logoutbtn.addEventListener('click', logout);