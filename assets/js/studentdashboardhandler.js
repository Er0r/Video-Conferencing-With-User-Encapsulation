var logoutbtn = document.getElementById('logoutbtn');


window.onload = function showData() {
    var count = 1;
    var marquee_contain = document.getElementById('marquee_contain');
    var session_contain = document.getElementById('session_contain');

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
    var session_count=1;
    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => {
            var newsession = document.createElement('div');
            newsession.className = "bg-light p-2 h5 font-weight-bold";
            newsession.id = `session-${session_count}`; 
            let sessionLink = childSnapshot.val().sessionLink;
            let roomName = childSnapshot.val().roomName;
            let sessiontime = childSnapshot.val().sessiontime;
            newsession.innerHTML = `
                ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                    class="btn btn-deafult text-white rounded-pill py-1"
                    id="sessionbtn-${session_count}"
                    style="background-color: #08165c"
                    onclick="startSession('${sessionLink}', '${roomName}', '${sessiontime}')"
                    >Join</span
                >
            `
            session_contain.appendChild(newsession);
            session_count++;
        })
       
    })
}
function startSession(sessionLink, roomName, sessionTime) {
    var date = moment().format(sessionTime);
    var today = moment();
    var status = today.to(date);
    alert(`ok ${today.to(date)}`);
    //condition //
    if(status.includes("minutes")) {
        console.log('ok');
    }
    

    // sessionStorage.setItem('roomName',roomName )
    // location.replace(`${sessionLink}`);
}

logoutbtn.addEventListener('click', ( e ) => {
    e.preventDefault();

})


function logout() {
    var flag =0;
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
                        flag = 1;
                        location.replace(`${location.origin}/studentlogin`);
                    }
                })
                if(flag === 1){
                    alertify.success('Signout Successfully');
                    flag++;
                }
            })
            
        }).catch((error) => {
            alertify.error('Please Try Again Later');
        });
        
      }).catch((error) => {
        alertify.error('Please Try Again Later');
    });
}
logoutbtn.addEventListener('click', logout);