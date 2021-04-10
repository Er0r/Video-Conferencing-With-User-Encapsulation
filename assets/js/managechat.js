

var sessionArray = new Array();
function showSession(){ 
    firebase.database().ref('/room').on('value', function(snapshot){ 
        snapshot.forEach((childSnapshot) => { 
            var name = childSnapshot.val().roomName;
            sessionArray.push(name);
        })
        sessionShow(sessionArray);
    })   
    
}
showSession();

function sessionShow(sessionArray){

    var sessionSet = new Set(sessionArray);
    var sesselect = document.getElementById('sessoption');
    sesselect.innerHTML = ``;
    for (let session of sessionSet){
        var newoption = document.createElement('option');
        newoption.innerHTML = `
            ${session}
        `
        sesselect.appendChild(newoption);
    }
}

function showUser() {
    var sesselect = document.getElementById("sessoption").value
    sessionStorage.setItem('sessionname',sesselect);
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
                        if(child.val().status === 'student') {
                            var user = child.val().username;
                            userset.add(user);
                        } 
                    })
                })
                UserShow(userset);
                countres++;
            }
        })
    })
    
    
}
var myvar = setInterval(showUser,5000);
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
            if(child.val().username === username && child.val().status === 'student' && child.val().sessionName === sessionStorage.getItem('sessionname')){
                sessionStorage.setItem('msgrandom',child.val().random);
                usermsgs.push(child.val().msg);
                
            }
            if(child.val().status === 'mentor' && child.val().sessionName === sessionStorage.getItem('sessionname')) {
                adminmsgs.push(child.val().msg);   
            }
           
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


