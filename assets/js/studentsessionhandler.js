window.addEventListener( 'load', () => { 
    if(!localStorage.getItem('usermsg'))
        localStorage.setItem('usermsg',Date.now());
    if(sessionStorage.getItem('status') === 'mentor') {
        document.getElementById('studentchatsection').hidden = true;
        document.getElementById('mentordiv').hidden = false;
        document.getElementById('mentorchatsection').hidden = false;
        var  my = setInterval(showUser, 1000);
        sessionShow();
       
    } else {
        var  myVar = setInterval(showUserMsg, 1000);
        document.getElementById('studentchatsection').hidden = false;
        document.getElementById('mentordiv').hidden = true;
        document.getElementById('mentorchatsection').hidden = true;
    }
    
    
})
function sessionShow(){
    var sesselect = document.getElementById('sess-name');
    sesselect.innerHTML = `${sessionStorage.getItem('roomName')}`; 
    sesselect.className = 'centered';  
}

function showUser() {
    
    var sesselect = sessionStorage.getItem('roomName')
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
                        if(child.val().status !== 'mentor') {
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



function UserShow(userset){
    for (let item of userset){
        var userbtn = document.createElement('div');
        var status = 'mentor';
        // sessionStorage.setItem('email', item);
        userbtn.classList="d-flex flex-column mb-2"
        userbtn.innerHTML = `
            <button class="btn btn-default btn-outline-primary rounded-sm mb-2"
            onclick="showUserMsgFromAdmin('${item}')">
            ${item} 
            </button>
        `;
        userlist.appendChild(userbtn);
    }
}


document.getElementById('studentmsgsbtn').addEventListener('click', ( e ) => {
    var studetnttxt = document.getElementById('studentmsgstxt').value;
    document.getElementById('studentmsgstxt').value='';
    if(!studetnttxt){
        alert('Please Enter a Text!');
    } else {
        var countres =0;
        var random = ``;
        
        firebase.database().ref('/room').on('value', function(snapshot){
            var count = localStorage.getItem('usermsg');

            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.val().roomName === sessionStorage.getItem('roomName') && countres === 0 ) {
                    random= childSnapshot.val().random;
                    sessionStorage.setItem('random',random);
                    // var randomgenerate = `${count}-${Math.random().toString(36).substring(2,7)}`;
                    var randomgenerate = `${count}`;
                    countres++;
                    firebase.database().ref('/room/'+random+'/user/'+randomgenerate).set({
                        msg: studetnttxt,
                        status: 'student',
                        username: sessionStorage.getItem('email'),
                        random: randomgenerate,
                        sessionName: sessionStorage.getItem('roomName')
                    }); 
                }
            })
            
            count++;
            localStorage.setItem('usermsg',Date.now());
        })
        showUserMsg();
    }
    
})

function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

var msgarray = new Array();

// push msgs to an array
function showUserMsg(){
    var usermsgs = new Array();
    var adminmsgs = new Array();
    clearArray(adminmsgs);
    clearArray(usermsgs);
    clearArray(msgarray);
    var random = sessionStorage.getItem('random');
    var roomName = sessionStorage.getItem('roomName');
    firebase.database().ref('/room/'+random+'/user').on('value', function(snap){ 
        snap.forEach((child) => {
            if(child.val().username === sessionStorage.getItem('email') && child.val().status === 'student' && child.val().sessionName === roomName){
                sessionStorage.setItem('msgrandom',child.val().random);
                usermsgs.push(child.val().msg);
                msgarray.push({'msg': child.val().msg, 'status': 'student'}); 
            } else if(child.val().studentName === sessionStorage.getItem('email') && child.val().status === 'mentor' && child.val().sessionName === roomName) {
                sessionStorage.setItem('msgrandom',child.val().random);
                adminmsgs.push(child.val().msg);
                msgarray.push({'msg': child.val().msg, 'status': 'mentor'}); 
            }
                
        })
    })
    showMsg(usermsgs,'student');
    showMsg(adminmsgs,'mentor');
    
}

function showUserMsgFromAdmin(username){
    var usermsgs = new Array();
    var adminmsgs = new Array();
    clearArray(adminmsgs);
    clearArray(usermsgs);
    clearArray(msgarray);
    sessionStorage.setItem('email',username);
    var random = sessionStorage.getItem('random');
    var roomName = sessionStorage.getItem('roomName');
    firebase.database().ref('/room/'+random+'/user').on('value', function(snap){ 
        snap.forEach((child) => {
            if(child.val().username === username && child.val().status === 'student' && child.val().sessionName === roomName){
                sessionStorage.setItem('msgrandom',child.val().random);
                usermsgs.push(child.val().msg);
                msgarray.push({'msg': child.val().msg, 'status': 'student'}); 
            } else if(child.val().studentName === username && child.val().status === 'mentor' && child.val().sessionName === roomName) {
                sessionStorage.setItem('msgrandom',child.val().random);
                adminmsgs.push(child.val().msg);
                msgarray.push({'msg': child.val().msg, 'status': 'mentor'}); 
            }
                
        })
    })
    showMsg(usermsgs,'student');
    showMsg(adminmsgs,'mentor');
}

document.getElementById('adminmsgsbtn').addEventListener('click', ( e ) => {
    var adminMsgtxt = document.getElementById('adminmsgstxt').value;
    document.getElementById('adminmsgstxt').value='';
    if(!adminMsgtxt) {
        alert('Please Enter a Message');
    } else {
        var countres =0;
        var random = ``;
        firebase.database().ref('/room').on('value', function(snapshot){
            var countad = localStorage.getItem('usermsg');
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.val().roomName === sessionStorage.getItem('roomName') && countres === 0) {
                    random= childSnapshot.val().random;
                    sessionStorage.setItem('random',random);
                    // var randomgenerate =  `${countad}-${Math.random().toString(36).substring(2,7)}`;
                    var randomgenerate = `${countad}`;
                    countres++;
                    firebase.database().ref('/room/'+random+'/user/'+randomgenerate).set({
                        msg: adminMsgtxt,
                        studentName: sessionStorage.getItem('email'),
                        random: randomgenerate,
                        sessionName: sessionStorage.getItem('roomName'),
                        status: 'mentor'
                    }); 
                }
            })
            countad++;
            localStorage.setItem('usermsg',countad);
            
        })
        adminMsgtxt.value = '';
        showUserMsg()
    }
    
})

var msgSet = new Set();
function showMsg(usermsgs,status){
    msgSet.clear();
    for(msg of msgarray) {
        msgSet.add(msg);
    }
    const usermsgsdiv = document.getElementById('usermsgs');
    usermsgsdiv.innerHTML = ``;
    for(let usmsg of msgSet){
        var usermsg = document.createElement('div');
        if(sessionStorage.getItem('status') === 'student' && usmsg['status'] === 'mentor') {
            usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2";
            usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
            usermsg.innerHTML = `${usmsg['msg']}`;
        } else if(sessionStorage.getItem('status') === 'student' && usmsg['status'] === 'student'){
            usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2 ml-auto";
            usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
            usermsg.innerHTML = `${usmsg['msg']}`;
        } else if(sessionStorage.getItem('status') === 'mentor' && usmsg['status'] === 'mentor') {
            usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2 ml-auto";
            usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
            usermsg.innerHTML = `${usmsg['msg']}`;
        } else if(sessionStorage.getItem('status') === 'mentor' && usmsg['status'] === 'student') {
            usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2";
            usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
            usermsg.innerHTML = `${usmsg['msg']}`;
        }

        // if(usmsg['status'] === 'mentor') {
        //     usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2";
        //     usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
        //     usermsg.innerHTML = `${usmsg['msg']}`;
        // } 
        // if (usmsg['status'] === 'student'){
        //     usermsg.className = "bg-light p-2 h6 font-weight-bold mt-2 ml-auto";
        //     usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
        //     usermsg.innerHTML = `${usmsg['msg']}`;
        // }
        usermsgsdiv.appendChild(usermsg);
    }
    
}


