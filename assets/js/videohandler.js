import helpers from './helpers.js';


window.addEventListener( 'load', () => {
    showMessages()
    document.getElementById( 'local' ).addEventListener( 'click', () => {
        if ( !document.pictureInPictureElement ) {
            document.getElementById( 'local' ).requestPictureInPicture()
                .catch( error => {
                    // Video failed to enter Picture-in-Picture mode.
                    console.error( error );
                } );
        }
    
        else {
            document.exitPictureInPicture()
                .catch( error => {
                    // Video failed to leave Picture-in-Picture mode.
                    console.error( error );
                } );
        }
    } );
    
    document.addEventListener( 'click', ( e ) => {
        if ( e.target && e.target.classList.contains( 'expand-remote-video' ) ) {
            helpers.maximiseStream( e );
        }

        else if ( e.target && e.target.classList.contains( 'mute-remote-mic' ) ) {
            helpers.singleStreamToggleMute( e );
        }
    } );
})


document.getElementById('studentmsgbtn').addEventListener('click', ( e ) => {
    var studetnttxt = document.getElementById('studetnttxt').value;
    if(!studetnttxt){
        alert('Please Enter a Text!');
    } else {
        var countres =0;
        var random = ``;
        firebase.database().ref('/room').on('value', function(snapshot){
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.val().roomName === sessionStorage.getItem('roomName') && countres === 0 ) {
                    random= childSnapshot.val().random;
                    sessionStorage.setItem('random',random);
                    var randomgenerate = Math.random().toString(36).substring(2,7);
                    countres++;
                    firebase.database().ref('/room/'+random+'/user/'+randomgenerate).set({
                        msg: studetnttxt,
                        username: sessionStorage.getItem('email'),
                        random: randomgenerate,
                        adminmsg: '' 
                    });  
                   
                }
            })
            
        })
    }
 
 })

 function showMessages(){
    var studentmsgnumber = 0;
    var msgcontain = document.getElementById('msg-contain');
    var random = sessionStorage.getItem('random');
    firebase.database().ref('/room/'+random+'/user').on('value', function(snapshot){
        var currvalue = 0;
        snapshot.forEach((childSnapshot) =>{
            console.log(childSnapshot.val());
            if(currvalue === studentmsgnumber && sessionStorage.getItem('email') === childSnapshot.val().username) {
                var studentmessage = document.createElement('div');
                studentmessage.className = `bg-light p-2 h6 font-weight-bold ml-auto`;
                studentmessage.style = `style="color: #7b99ec; width: 50%; border-radius: 5px"`;
                studentmessage.id = `stmsg-id-${studentmsgnumber}`;
                studentmessage.innerHTML = `
                    ${childSnapshot.val().msg}
                `
                if(childSnapshot.val().adminmsg){
                    var adminmessage = document.createElement('div');
                    adminmessage.className = `bg-light p-2 h6 font-weight-bold `;
                    adminmessage.style = "color: #7b99ec; width: 50%; border-radius: 5px";
                    adminmessage.innerHTML = `
                        ${childSnapshot.val().adminmsg}
                    `
                    msgcontain.appendChild(adminmessage);
                }
                msgcontain.appendChild(studentmessage);
                
                studentmsgnumber++;
                currvalue ++;
            }   
        })
    }) 
}
        
 