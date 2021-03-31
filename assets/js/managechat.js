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
showSession();

function showUser() {
    var sesselect = document.getElementById("sessoption").value
    var userlist = document.getElementById('userlist');
    userlist.innerHTML = ``;
    var countres =0;
    var random = ``;
    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => { 
            if(childSnapshot.val().roomName === sesselect && countres === 0 ) {
                random = childSnapshot.val().random;
                sessionStorage.setItem('random',random);
                firebase.database().ref('/room/'+random+'/user').on('value', function(snap){ 
                    snap.forEach((child) => {
                        var userbtn = document.createElement('div');
                        // userbtn.className="btn btn-default btn-outline-primary rounded-sm mb-2"
                        // userbtn.id = `userid-${child.val().random}`;
                        
                        userbtn.innerHTML = `
                            <button class="btn btn-default btn-outline-primary rounded-sm mb-2"
                            id="userid-${child.val().random}"
                            onclick='initialize("userid-${child.val().random}","${child.val().msg}")'>
                            ${child.val().username} 
                            </button>
                        `;
                    
                        userlist.appendChild(userbtn);
                    })
                })
                countres++;
            }
        })
    })
}

function initialize(id,msg){
    usermsgs.innerHTML=``;  
    showMessages(id,msg)
}

function showMessages(id,msg){
    
    const usermsgs = document.getElementById('usermsgs');
    const usermsg = document.createElement('div');
    usermsg.className = "bg-light p-2 h6 font-weight-bold justify-content-end mt-2";
    usermsg.style="color: #7b99ec; width: 50%; border-radius: 5px"
    usermsg.innerHTML = `${msg}`;
    usermsg.id= `usermsg-${id}`;
    usermsgs.appendChild(usermsg);
}

