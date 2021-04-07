window.onload = function showData(){
    var session_contain = document.getElementById('session_contain');
    var up_session_contain = document.getElementById('up_session_contain');
    var session_count=1;
    var promembership1 = document.getElementById('promembership-1');
    var promembership2 = document.getElementById('promembership-2');
    // if(sessionStorage.getItem('mentorship') === 'Pro Mentorship-1') {
    //     var promembership1 = document.getElementById('promembership-1'); 
    //     var promembership2 = document.getElementById('promembership-2');
    //     promembership1.hidden = false;
    //     promembership2.hidden = true;
    // }else if(sessionStorage.getItem('mentorship') === 'Pro Mentorship-2'){
    //     var promembership1 = document.getElementById('promembership-1');
    //     var promembership2 = document.getElementById('promembership-2');
    //     promembership2.hidden = false;
    //     promembership1.hidden = true;
    // }
    promembership2.hidden = true;
    promembership1.hidden = false;
    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => {
            var newsession = document.createElement('div');
            newsession.className = "bg-light p-2 h5 font-weight-bold";
            
            let sessionLink = childSnapshot.val().sessionLink;
            let roomName = childSnapshot.val().roomName;
            let sessionTime = childSnapshot.val().sessiontime;
            newsession.id = `${sessionTime}`;
            newsession.style.display = 'none'; 
            newsession.innerHTML = `
                ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                    class="btn btn-default text-white rounded-pill py-1"
                    style="display:none; background-color: #08165c" 
                    id="sessionbtn-${session_count}"
                    onclick="startSession('${sessionLink}', '${roomName}')"
                    >Join</span
                >
            `
            session_contain.appendChild(newsession);
            session_count++;
        })
        checkSessionValidity();
    })


    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => {
            var newsession = document.createElement('div');
            newsession.className = "bg-light p-2 h5 font-weight-bold";
            
            let sessionLink = childSnapshot.val().sessionLink;
            let roomName = childSnapshot.val().roomName;
            let sessionTime = childSnapshot.val().sessiontime;
            newsession.id = `${sessionTime}`; 
            newsession.style.display = 'none';
            newsession.innerHTML = `
                ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                    class="btn btn-default text-white rounded-pill py-1"
                    style="display:none; background-color: #08165c" 
                    id="sessionbtn-${session_count}"
                    onclick="startSession('${sessionLink}', '${roomName}')"
                    >Join</span
                >
            `
            up_session_contain.appendChild(newsession);
            session_count++;
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
        if(status.includes("in 10 minutes") || status.includes("in 9 minutes") || status.includes("in 8 minutes") || status.includes("in 7 minutes") || status.includes("in 6 minutes")  || status.includes("in 5 minutes") || status.includes("in 4 minutes") || status.includes("in 3 minutes") || status.includes("in 2 minutes") ) {
            document.getElementById('session_contain').querySelectorAll('div')[i].style.display = 'block';
            document.getElementById('session_contain').querySelectorAll('div')[i].querySelector('span').style.display = 'block';
            document.getElementById('up_session_contain').querySelectorAll('div')[i].style.display = 'none';
        } else {
            document.getElementById('up_session_contain').querySelectorAll('div')[i].style.display = 'block';
            document.getElementById('session_contain').querySelectorAll('div')[i].style.display = 'none';
        }
    }
  
}

function startSession(sessionLink, roomName) {

    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => { 
            if(childSnapshot.val().mentorName === sessionStorage.getItem('mentorname')) {
                firebase.database().ref('/room/'+childSnapshot.val().random).update({
                    mentoronline: 1
                });
            }
        })
    })
    sessionStorage.setItem('roomName',roomName )
    location.replace(`${sessionLink}`);
}

function myFunction() {
    myVar = setInterval(checkSessionValidity, 5000);
}

myFunction();


var createnoticebtn = document.getElementById('createnoticebtn').addEventListener('click', ( e ) => {
    e.preventDefault();
    location.replace(`${window.location.origin}/mentornotice`);
})
