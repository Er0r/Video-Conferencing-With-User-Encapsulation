
window.onload = function showData(){
    var session_contain = document.getElementById('session_contain');
    var session_count=1;
    firebase.database().ref('/room').on('value', function(snapshot){
        snapshot.forEach((childSnapshot) => {
            var newsession = document.createElement('div');
            newsession.className = "bg-light p-2 h5 font-weight-bold";
            newsession.id = `session-${session_count}`; 
            let sessionLink = childSnapshot.val().sessionLink;
            let roomName = childSnapshot.val().roomName;
            newsession.innerHTML = `
                ${childSnapshot.val().roomName} <br /> ${childSnapshot.val().sessiontime} <br /><span
                    class="btn btn-deafult text-white rounded-pill py-1"
                    id="sessionbtn-${session_count}"
                    style="background-color: #08165c"
                    onclick="startSession('${sessionLink}', '${roomName}')"
                    >Join</span
                >
            `
            session_contain.appendChild(newsession);
            session_count++;
        })
       
    })


}

function startSession(sessionLink, roomName) {
    sessionStorage.setItem('roomName',roomName )
    location.replace(`${sessionLink}`);
}