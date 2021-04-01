var usermessages = [{'username': '','msg':'','count': 0}];
var global_msg_count=0;

function init(){
    showSession();
    // showUser();
}

init();
function showSession(){ 
    var count = 2;
    var sesselect = document.getElementById('sessoption');
    firebase.database().ref('/room').on('value', function(snapshot){ 
        snapshot.forEach((childSnapshot) => { 
            var newoption = document.createElement('option');
            newoption.id = `${count}`;
            newoption.innerHTML = `
                ${childSnapshot.val().roomName}
            `
            count++;
            sesselect.appendChild(newoption);
        })
        
    })
}

function showUser() {
    var sesselect = document.getElementById("sessoption").value
    var userlist = document.getElementById('userlist');
    userlist.innerHTML = ``;
    var countres =0;
    var random = ``;
    var userset = new Set();
    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => {  
            if(childSnapshot.val().roomName === sesselect && countres === 0 ) {
                random = childSnapshot.val().random;
                sessionStorage.setItem('random',random);
                firebase.database().ref('/room/'+random+'/user').on('value', function(snap){ 
                    snap.forEach((child) => {
                        sessionStorage.setItem('msgrandom',child.val().random);
                        var user = child.val().username;
                        userset.add(user);
                    })
                })
                UserShow(userset);
                countres++;
            }
        })
    })
    
    
}

function UserShow(userset){
    for (let item of userset){
        var userbtn = document.createElement('div');
        userbtn.classList="d-flex flex-column mb-2"
        userbtn.innerHTML = `
            <button class="btn btn-default btn-outline-primary rounded-sm mb-2"
            onclick='showUserMsg("${item}")'>
            ${item} 
            </button>
        `;
        userlist.appendChild(userbtn);
    }
}

function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

function showUserMsg(username){
    sessionStorage.setItem('username', username);
    var usermsgs = new Array();
    var adminmsgs = new Array();
    clearArray(usermsgs);
    clearArray(adminmsgs);
    var random = sessionStorage.getItem('random');
    firebase.database().ref('/room/'+random+'/user').on('value', function(snap){ 
        snap.forEach((child) => {
            if(child.val().username === username)
                usermsgs.push(child.val().msg);
                if(child.val().username === username && child.val().adminmsg)
                    adminmsgs.push(child.val().adminmsg);
        })
    })
    showMsg(usermsgs,adminmsgs);
}


function showMsg(usermsgs,adminmsgs){
    const usermsgsdiv = document.getElementById('usermsgs');
    usermsgsdiv.innerHTML = ``;
    for(let usmsg of usermsgs){
        var usermsg = document.createElement('div');
        usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2 mb-2";
        usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
        usermsg.innerHTML = `${usmsg}`;
        usermsgsdiv.appendChild(usermsg);
    }
    for(let admsg of adminmsgs) {
        var adminmsg = document.createElement('div');
        adminmsg.className = "bg-light p-2 h6 font-weight-bold ml-auto"
        adminmsg.style="color: #7b99ec; width: 50%; border-radius: 5px"

        adminmsg.innerHTML = `${admsg}`;
        usermsgsdiv.appendChild(adminmsg);
    }
}


var adminmsgsbtn = document.getElementById('adminmsgsbtn');
adminmsgsbtn.addEventListener('click', ( e ) => {
    var adminmsgstxt = document.getElementById('adminmsgstxt').value;
    var random = sessionStorage.getItem('random');
    var msgrandom = sessionStorage.getItem('msgrandom');
     
    firebase.database().ref('/room/'+random+'/user/'+msgrandom).update({
        adminmsg: adminmsgstxt
    })
    showUserMsg(sessionStorage.getItem('username'));
})
