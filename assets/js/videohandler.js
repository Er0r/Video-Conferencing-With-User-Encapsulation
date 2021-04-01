import helpers from './helpers.js';


window.addEventListener( 'load', () => {

    // document.querySelector( '#toggle-chat-pane' ).addEventListener( 'click', ( e ) => {
    //     let chatElem = document.querySelector( '#chat-pane' );
    //     let mainSecElem = document.querySelector( '#main-section' );

    //     if ( chatElem.classList.contains( 'chat-opened' ) ) {
    //         chatElem.setAttribute( 'hidden', true );
    //         mainSecElem.classList.remove( 'col-md-9' );
    //         mainSecElem.classList.add( 'col-md-12' );
    //         chatElem.classList.remove( 'chat-opened' );
    //     }

    //     else {
    //         chatElem.attributes.removeNamedItem( 'hidden' );
    //         mainSecElem.classList.remove( 'col-md-12' );
    //         mainSecElem.classList.add( 'col-md-9' );
    //         chatElem.classList.add( 'chat-opened' );
    //     }

    //     //remove the 'New' badge on chat icon (if any) once chat is opened.
    //     setTimeout( () => {
    //         if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
    //             helpers.toggleChatNotificationBadge();
    //         }
    //     }, 300 );
    // } );

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
    showMessages()

})

document.getElementById('studentmsgbtn').addEventListener('click', ( e ) => {
    var studetnttxt = document.getElementById('studetnttxt').value;
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
    showMessages();
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
                msgcontain.appendChild(studentmessage);
                studentmsgnumber++;
                currvalue ++;
            }   
        })
    }) 
}
        
 