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
            // ekhane foundation program er if else hobe // 
            if(sessionStorage.getItem('membership').includes('Foundation')) {
                if(childSnapshot.val().selectprogram === 'Foundation Membership Program') {
                    var newsession = document.createElement('div');
                    newsession.className = "bg-light p-2 h5 font-weight-bold";
                    newsession.id = `session-${session_count}`; 
                    let sessionLink = childSnapshot.val().sessionLink;
                    let roomName = childSnapshot.val().roomName;
                    let sessiontime = childSnapshot.val().sessiontime;
                    newsession.id = `${sessiontime}`; 
                    newsession.innerHTML = `
                        ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                            class="btn btn-deafult text-white rounded-pill py-1"
                            id="sessionbtn-${session_count}"
                            style=" display:none; background-color: #08165c"
                            onclick="startSession('${sessionLink}', '${roomName}')"
                            >Join</span
                        >
                    `
                    session_contain.appendChild(newsession);
                    session_count++;
                }
            } else {
                if(childSnapshot.val().selectprogram === 'Pro Membership Program') { 
                    var newsession = document.createElement('div');
                    newsession.className = "bg-light p-2 h5 font-weight-bold";
                    newsession.id = `session-${session_count}`; 
                    let sessionLink = childSnapshot.val().sessionLink;
                    let roomName = childSnapshot.val().roomName;
                    let sessiontime = childSnapshot.val().sessiontime;
                    newsession.id = `${sessiontime}`; 
                    newsession.innerHTML = `
                        ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                            class="btn btn-deafult text-white rounded-pill py-1"
                            id="sessionbtn-${session_count}"
                            style=" display:none; background-color: #08165c"
                            onclick="startSession('${sessionLink}', '${roomName}')"
                            >Join</span
                        >
                    `
                    session_contain.appendChild(newsession);
                    session_count++;
                }
            }
            
        })
        checkSessionValidity();
    })
}

function checkSessionValidity() {
    var len = document.getElementById('session_contain').querySelectorAll('div').length;
    for(var i =0; i < len; i++) {
        var sessioncontainerdiv = document.getElementById('session_contain').querySelectorAll('div')[i];
        var time = sessioncontainerdiv.id;
        var date = moment().format(time);
        var today = moment();
        var status = today.to(date);
        if(status.includes("in 10 minutes") || status.includes("in 10 minutes")  || status.includes("in 9 minutes") || status.includes("in 8 minutes") || status.includes("in 7 minutes") || status.includes("in 6 minutes")  || status.includes("in 5 minutes") || status.includes("in 4 minutes") || status.includes("in 3 minutes") || status.includes("in 2 minutes") ) {
            document.getElementById('session_contain').querySelectorAll('div')[i].querySelector('span').style.display = 'block';
            console.log('ok');
            
        } 
    }
  
}
function startSession(sessionLink, roomName) {
    sessionStorage.setItem('roomName',roomName )
    location.replace(`${sessionLink}`);
}

logoutbtn.addEventListener('click', ( e ) => {
    e.preventDefault();

})

function myFunction() {
    myVar = setInterval(checkSessionValidity, 5000);
}

myFunction();


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