var logoutbtn = document.getElementById('logoutbtn');


function showData() {
    document.getElementById('username').innerHTML = `Welcome ${sessionStorage.getItem('username')}`;
    var count = 1;
    var tablebody  = document.getElementById('tablebody');
    var marquee_contain = document.getElementById('marquee_contain');
    marquee_contain.innerHTML = ``;
    tablebody.innerHTML= ``;
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
        
        snapshot.forEach((childSnapshot)=> { 

            if(childSnapshot.val().membership === sessionStorage.getItem('membership')) {
                var newtablerow = document.createElement('tr');
                newtablerow.id = `${childSnapshot.val().sessiontime}`;
                var sessionnametabledata = document.createElement('td');
                sessionnametabledata.id = `data-${session_count}`;
                sessionnametabledata.innerHTML = `${childSnapshot.val().roomName}`;
                
                var sessiontimetabledata = document.createElement('td');
                sessiontimetabledata.innerHTML = `${childSnapshot.val().sessiontime}`;
    
        
                var sessionmentornametabledata = document.createElement('td');
                sessionmentornametabledata.innerHTML = `${childSnapshot.val().mentorName}`;
                
                
                var sessionLink = childSnapshot.val().sessionLink; 
                var roomName = childSnapshot.val().roomName;
                var action = document.createElement('td');
                action.innerHTML = ` 
                        RoomName: ${childSnapshot.val().roomName} <br /> 
                        SessionTime: ${childSnapshot.val().sessiontime} <br />
                        <button class="btn btn-success rounded-pill" style="display: none" id="availability-${session_count}"> OnGoing... <br /> </button>
                        <button class="btn btn-warning mb-2 w-100 rounded-pill" id="availability-${session_count}"> Upcoming... <br /> </button>
                        <span
                        class="btn btn-deafult text-white rounded-pill py-1"
                        id="sessionbtn-${session_count}"
                        style="display: none; background-color: #08165c"
                        onclick="startSession('${sessionLink}', '${roomName}')"
                        >Join</span
                    
                `;
    
                newtablerow.appendChild(sessionnametabledata);
                newtablerow.appendChild(sessiontimetabledata);
                newtablerow.appendChild(sessionmentornametabledata);
                newtablerow.appendChild(action);
                tablebody.appendChild(newtablerow);
                session_count++;
            }
            
        })
        checkSessionValidity();
    })
}

function checkSessionValidity() {
    var len = document.getElementById('tablebody').querySelectorAll('tr').length;
    for(var i =0; i < len; i++) {
        var sessioncontainertable = document.getElementById('tablebody').querySelectorAll('tr')[i];
        var time = sessioncontainertable.id;
        var date = moment().format(time);
        var today = moment();
        var status = today.to(date);
        console.log(status);
        if(document.getElementById('tablebody').querySelectorAll('tr')[i]) {
            var joinbtnvis = document.getElementById('tablebody').querySelectorAll('tr')[i].querySelector('span').style.display;
            if(status.includes("in 10 minutes")  || status.includes("in 9 minutes") || status.includes("in 8 minutes") || status.includes("in 7 minutes") || status.includes("in 6 minutes")  || status.includes("in 5 minutes") || status.includes("in 4 minutes") || status.includes("in 3 minutes") || status.includes("in 2 minutes") || status.includes("minutes ago") || status.includes("seconds ago")  ) {
                firebase.database().ref('/room').on('value', function(snapshot){ 
                    snapshot.forEach((childSnapshot) => {
                        if(sessioncontainertable.id === childSnapshot.val().sessiontime) {
                            if(childSnapshot.val().mentoronline > 0 && joinbtnvis === 'none'){
                                document.getElementById('tablebody').querySelectorAll('tr')[i].querySelectorAll('button')[0].style.display = 'block';
                                document.getElementById('tablebody').querySelectorAll('tr')[i].querySelectorAll('button')[1].style.display = 'none';
                                document.getElementById('tablebody').querySelectorAll('tr')[i].querySelector('span').style.display = 'block';
                                    
                            }  else {
                                document.getElementById('tablebody').querySelectorAll('tr')[i].querySelectorAll('button')[1].style.display = 'block';
                                document.getElementById('tablebody').querySelectorAll('tr')[i].querySelectorAll('button')[0].style.display = 'none';
                            }
                                
                        }
                    })
                    
                })
            } 
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
// checkSessionValidity();
showData();
// showData();
function myFunction() {
    myVar = setInterval(checkSessionValidity, 5000);
    init = setInterval(showData, 5000);
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
                        //cookie
                        document.cookie = "student=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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